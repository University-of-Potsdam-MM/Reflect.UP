<?php

// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * External Web Service Template
 *
 * @package    localwstemplate
 * @copyright  2011 Moodle Pty Ltd (http://moodle.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once($CFG->libdir . "/externallib.php");

class local_reflection_external extends external_api {

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.5
     */
    public static function get_calendar_reflection_events_parameters() {
        return new external_function_parameters(
                array('events' => new external_single_structure(
                            array(
                                    'eventids' => new external_multiple_structure(
                                            new external_value(PARAM_INT, 'event ids')
                                            , 'List of event ids',
                                            VALUE_DEFAULT, array(), NULL_ALLOWED
                                                ),
                                    'courseids' => new external_multiple_structure(
                                            new external_value(PARAM_INT, 'course ids')
                                            , 'List of course ids for which events will be returned',
                                            VALUE_DEFAULT, array(), NULL_ALLOWED
                                                ),
                                    'groupids' => new external_multiple_structure(
                                            new external_value(PARAM_INT, 'group ids')
                                            , 'List of group ids for which events should be returned',
                                            VALUE_DEFAULT, array(), NULL_ALLOWED
                                                )
                            ), 'Event details', VALUE_DEFAULT, array()),
                    'options' => new external_single_structure(
                            array(
                                    'userevents' => new external_value(PARAM_BOOL,
                                             "Set to true to return current user's user events",
                                             VALUE_DEFAULT, true, NULL_ALLOWED),
                                    'siteevents' => new external_value(PARAM_BOOL,
                                             "Set to true to return global events",
                                             VALUE_DEFAULT, true, NULL_ALLOWED),
                                    'timestart' => new external_value(PARAM_INT,
                                             "Time from which events should be returned",
                                             VALUE_DEFAULT, 0, NULL_ALLOWED),
                                    'timeend' => new external_value(PARAM_INT,
                                             "Time to which the events should be returned",
                                             VALUE_DEFAULT, time(), NULL_ALLOWED),
                                    'ignorehidden' => new external_value(PARAM_BOOL,
                                             "Ignore hidden events or not",
                                             VALUE_DEFAULT, true, NULL_ALLOWED),

                            ), 'Options', VALUE_DEFAULT, array())
                )
        );
    }

    /**
     * Get Calendar events
     *
     * @param array $events A list of events
     * @package array $options various options
     * @return array Array of event details
     * @since Moodle 2.5
     */
    public static function get_calendar_reflection_events($events = array(), $options = array()) {
        
        
        global $SITE, $DB, $USER, $CFG;
        require_once($CFG->dirroot."/calendar/lib.php");

        // Parameter validation.
        $params = self::validate_parameters(self::get_calendar_reflection_events_parameters(), array('events' => $events, 'options' => $options));
        $course = $DB->get_record('course', array('idnumber'=>'UPR1'));

        if (!$course)
            return;

        $params['events']['courseids'] = array(0 => $course->id );
        $params['events']['groupids'] = array();

        $funcparam = array('courses' => array(), 'groups' => array());
        $hassystemcap = true;//has_capability('moodle/calendar:manageentries', context_system::instance());
        $warnings = array();

        //file_put_contents("D:\output.txt", "Success", FILE_APPEND);

        $courses = enrol_get_my_courses();

        $courses = array_keys($courses);
        foreach ($params['events']['courseids'] as $id) {
            if (in_array($id, $courses)) {
                $funcparam['courses'][] = $id;
            } else {
                $warnings[] = array('item' => $id, 'warningcode' => 'nopermissions', 'message' => 'you do not have permissions to access this course');
            }
        }
        
        $funcparam['groups'] = array();    
        $funcparam['users'] = false;
        
        $eventlist = calendar_get_events($params['options']['timestart'], 
            $params['options']['timeend'], 
            $funcparam['users'], 
            $funcparam['groups'],
            $funcparam['courses'], 
            true, 
            $params['options']['ignorehidden']
        );

        //////////////////////////////////////////////////////////
        
        // WS expects arrays.
        $events = array();
        foreach ($eventlist as $id => $event) {
            $events[$id] = (array) $event;
        }

        // We need to get events asked for eventids.
        $eventsbyid = calendar_get_events_by_id($params['events']['eventids']);
        foreach ($eventsbyid as $eventid => $eventobj) {
            $event = (array) $eventobj;
            if (isset($events[$eventid])) {
                   continue;
            }
            if ($hassystemcap) {
                // User can see everything, no further check is needed.
                $events[$eventid] = $event;
            } else if (!empty($eventobj->modulename)) {
                $cm = get_coursemodule_from_instance($eventobj->modulename, $eventobj->instance);
                if (groups_course_module_visible($cm)) {
                    $events[$eventid] = $event;
                }
            } else {
                // Can the user actually see this event?
                $eventobj = calendar_event::load($eventobj);
                if (($eventobj->courseid == $SITE->id) ||
                            (!empty($eventobj->groupid) && in_array($eventobj->groupid, $groups)) ||
                            (!empty($eventobj->courseid) && in_array($eventobj->courseid, $courses)) ||
                            ($USER->id == $eventobj->userid) ||
                            (calendar_edit_event_allowed($eventid))) {
                    $events[$eventid] = $event;
                } else {
                    $warnings[] = array('item' => $eventid, 'warningcode' => 'nopermissions', 'message' => 'you do not have permissions to view this event');
                }
            }
        }


        return array('events' => $events, 'warnings' => $warnings);
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.5
     */
    public static function  get_calendar_reflection_events_returns() {
        return new external_single_structure(
            array(
                'events' => new external_multiple_structure( 
                    new external_single_structure(
                        array(
                            'id' => new external_value(PARAM_INT, 'event id'),
                            'name' => new external_value(PARAM_TEXT, 'event name'),
                            'description' => new external_value(PARAM_RAW, 'Description', VALUE_OPTIONAL, null, NULL_ALLOWED),
                            'format' => new external_format_value('description'),
                            'courseid' => new external_value(PARAM_INT, 'course id'),
                            'groupid' => new external_value(PARAM_INT, 'group id'),
                            'userid' => new external_value(PARAM_INT, 'user id'),
                            'repeatid' => new external_value(PARAM_INT, 'repeat id'),
                            'modulename' => new external_value(PARAM_TEXT, 'module name', VALUE_OPTIONAL, null, NULL_ALLOWED),
                            'instance' => new external_value(PARAM_INT, 'instance id'),
                            'eventtype' => new external_value(PARAM_TEXT, 'Event type'),
                            'timestart' => new external_value(PARAM_INT, 'timestart'),
                            'timeduration' => new external_value(PARAM_INT, 'time duration'),
                            'visible' => new external_value(PARAM_INT, 'visible'),
                            'uuid' => new external_value(PARAM_TEXT, 'unique id of ical events', VALUE_OPTIONAL, null, NULL_NOT_ALLOWED),
                            'sequence' => new external_value(PARAM_INT, 'sequence'),
                            'timemodified' => new external_value(PARAM_INT, 'time modified'),
                            'subscriptionid' => new external_value(PARAM_INT, 'Subscription id', VALUE_OPTIONAL, null, NULL_ALLOWED),
                        ), 
                    'event')
                 ),
                 'warnings' => new external_warnings(),
                 'test' => new external_value(PARAM_RAW, 'test', VALUE_OPTIONAL, null, NULL_ALLOWED)
            )
        );
    }

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.5
     */

    public static function get_feedbacks_parameters() {
        return new external_function_parameters(
                array(
                    'options' => new external_single_structure(
                            array(
                                    'timestart' => new external_value(PARAM_INT,
                                             "Time from which feedbacks should be returned",
                                             VALUE_DEFAULT, 0, NULL_ALLOWED),
                                    'timeend' => new external_value(PARAM_INT,
                                             "Time to which feedbacks should be returned",
                                             VALUE_DEFAULT, time(), NULL_ALLOWED)
                            ), 'Options', VALUE_DEFAULT, array())
                )
        );
    }


    /**
     * Get Fedback events
     * @package array $options various options
     * @return array Array of feedback details
     * @since Moodle 2.5
     */
    public static function get_feedbacks($options = array()) {

        global $SITE, $DB, $USER, $CFG;
        require_once($CFG->dirroot."/mod/feedback/lib.php");

        $fedbacks = array();


        if (!$course = $DB->get_record('course', array('idnumber'=>'UPR1'))) {
            //TODO: error
        }


        $feedback_list = get_all_instances_in_course("feedback", $course, NULL, true);
           
        //file_put_contents("D:\output.txt", "Feedbacks: \n", FILE_APPEND);
        //file_put_contents("D:\output.txt", print_r($feedback_list, true)."\n", FILE_APPEND);

        foreach ($feedback_list as $id => $feedback_object) {
     
            if (feedback_is_already_submitted($feedback_object->id))
                continue;
            //TODO: Time und Caps beachten


            $feedbackitems = $DB->get_records('feedback_item',array('feedback'=>$feedback_object->id));
            $questions = array();

            foreach ($feedbackitems as $item_id => $item_object) {

                if ($item_object->typ != 'textfield' AND
                    $item_object->typ != 'textarea' AND
                    $item_object->typ != 'multichoice')
                    continue;


                $question = array(
                    'id' => $item_object->id,
                    'questionText' => $item_object->name,
                    'type' => $item_object->typ
                    );

                if ($item_object->typ == 'multichoice')
                    $question['choices'] = $item_object->presentation;

                $questions[$item_id] = (array)$question;
            }


            $feedback = array(
                'name' => $feedback_object->name,
                'id' => $feedback_object->id,
                'questions' => $questions
                );

            $feedbacks[$id] = (array)$feedback;

        }

        return array('feedbacks' => $feedbacks);
    }


    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.5
     */
    public static function  get_feedbacks_returns() {
        return new external_single_structure(
            array(
                'feedbacks' => new external_multiple_structure(
                    new external_single_structure(
                        array(
                            'name' => new external_value(PARAM_TEXT, 'feedback name'),
                            'id' => new external_value(PARAM_INT, 'event id'),
                            'questions' => new external_multiple_structure( 
                                new external_single_structure(
                                    array(
                                        'id' => new external_value(PARAM_INT, 'Question Id'),
                                        'questionText' => new external_value(PARAM_TEXT, 'Question Text'),
                                        'type' => new external_value(PARAM_TEXT, 'Question Text'),
                                        'choices' => new external_value(PARAM_TEXT, 'Choices', VALUE_OPTIONAL)
                                    ),'Question', VALUE_DEFAULT, array()
                                ), VALUE_DEFAULT, array()
                            )
                        ),'Feedback'
                    )
                )
            )
        );
    }
}