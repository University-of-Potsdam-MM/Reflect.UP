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
     * Returns boolean if self enrolment succeded
     * @return boolean
     * @since Moodle 2.5
     */
    public static function enrol_self_parameters() {
        return new external_function_parameters(
                array()
        );
    }

    /**
     * enrol_self in course
     *
     * @package array $options various options
     * @return array Array of self enrolment details
     * @since Moodle 2.5
     */
    public static function enrol_self() {
        global $DB, $USER, $CFG;

        require_once($CFG->libdir . '/enrollib.php');

        $enrolment = false;
        $warnings = array();


        // get instance
        $course = $DB->get_record('course', array('idnumber' => 'UPR1'));
        $param = array('shortname' => 'student');
        $studentRole = $DB->get_record('role', $param);

        // Exception Handling
        if (empty($course)) {
            $errorparams = new stdClass();
            throw new moodle_exception('wsnocourse', 'enrol_self', $errorparams);
        }

        if (empty($studentRole)) {
            $errorparams = new stdClass();
            $errorparams->courseid = $course->id;
            throw new moodle_exception('wsnostudentrole', 'enrol_self', $errorparams);
        }

        $instance = null;
        $enrolinstances = enrol_get_instances($course->id, true);
        foreach ($enrolinstances as $courseenrolinstance) {
            if ($courseenrolinstance->enrol == "manual") {
                $instance = $courseenrolinstance;
                break;
            }
        }
        if (empty($instance)) {
            $errorparams = new stdClass();
            $errorparams->courseid = $course->id;
            throw new moodle_exception('wsnoinstance', 'enrol_self', $errorparams);
        }


        // prepare enrolment
        $timestart = time();
        if ($instance->enrolperiod) {
            $timeend = $timestart + $instance->enrolperiod;
        } else {
            $timeend = 0;
        }

        // retrieve the manual enrolment plugin
        $transaction = $DB->start_delegated_transaction();
        $enrol = enrol_get_plugin('manual');

        if (empty($enrol)) {
            throw new moodle_exception('manualpluginnotinstalled', 'enrol_self');
        }

        if (!$enrol->allow_enrol($instance)) {
            $errorparams = new stdClass();
            $errorparams->roleid = $studentid;
            $errorparams->courseid = $course->id;
            $errorparams->userid = $USER->id;
            throw new moodle_exception('wscannotenrol', 'enrol_self', '', $errorparams);
        }

        $enrol->enrol_user($instance, $USER->id, $studentRole->id);

        $transaction->allow_commit();

        $result['enrolment'] = true;
        $result['userid'] = $USER->id;
        ;

        return $result;
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.5
     */
    public static function enrol_self_returns() {
        return new external_single_structure(
                array(
            'enrolment' => new external_value(PARAM_BOOL, 'result'),
            'userid' => new external_value(PARAM_INT, 'uderid')
                )
        );
    }

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
                        , 'List of event ids', VALUE_DEFAULT, array(), NULL_ALLOWED
                ),
                'courseids' => new external_multiple_structure(
                        new external_value(PARAM_INT, 'course ids')
                        , 'List of course ids for which events will be returned', VALUE_DEFAULT, array(), NULL_ALLOWED
                ),
                'groupids' => new external_multiple_structure(
                        new external_value(PARAM_INT, 'group ids')
                        , 'List of group ids for which events should be returned', VALUE_DEFAULT, array(), NULL_ALLOWED
                )
                    ), 'Event details', VALUE_DEFAULT, array()),
            'options' => new external_single_structure(
                    array(
                'userevents' => new external_value(PARAM_BOOL, "Set to true to return current user's user events", VALUE_DEFAULT, true, NULL_ALLOWED),
                'siteevents' => new external_value(PARAM_BOOL, "Set to true to return global events", VALUE_DEFAULT, true, NULL_ALLOWED),
                'timestart' => new external_value(PARAM_INT, "Time from which events should be returned", VALUE_DEFAULT, 0, NULL_ALLOWED),
                'timeend' => new external_value(PARAM_INT, "Time to which the events should be returned", VALUE_DEFAULT, time(), NULL_ALLOWED),
                'ignorehidden' => new external_value(PARAM_BOOL, "Ignore hidden events or not", VALUE_DEFAULT, true, NULL_ALLOWED),
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
        require_once($CFG->dirroot . "/calendar/lib.php");

        // Parameter validation.
        $params = self::validate_parameters(self::get_calendar_reflection_events_parameters(), array('events' => $events, 'options' => $options));
        $course = $DB->get_record('course', array('idnumber' => 'UPR1'));

        if (!$course)
            return;

        $params['events']['courseids'] = array(0 => $course->id);
        $params['events']['groupids'] = array();

        $funcparam = array('courses' => array(), 'groups' => array());
        $hassystemcap = true; //has_capability('moodle/calendar:manageentries', context_system::instance());
        $warnings = array();

        ////file_put_contents("D:\output.txt", "Success", FILE_APPEND);

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

        $eventlist = calendar_get_events($params['options']['timestart'], $params['options']['timeend'], $funcparam['users'], $funcparam['groups'], $funcparam['courses'], true, $params['options']['ignorehidden']
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

        // testing addFeedback
//        $forumName = "Feedback Forum";
//        self::addFeedbackForumToCourse($course->id, $forumName);
//        self::addFeedbackPostToForum($course->id, $forumName, "find ich gut");



        return array('events' => $events, 'warnings' => $warnings);
    }

    public static function addFeedbackPostToForum($courseid, $forumName, $feedback) {

        global $DB, $CFG, $USER;
        require_once($CFG->dirroot . "/mod/forum/lib.php");
        include_once($CFG->dirroot . "/course/lib.php");

        $forum = $DB->get_record("forum", array('name' => $forumName, 'course' => $courseid));

        $discussion = new stdClass();
        $discussion->name = "Feedback von " . $USER->username;
        $discussion->message = $feedback;
        $discussion->forum = $forum->id;
        $discussion->messageformat = 1;
        $discussion->messagetrust = 0;
        $discussion->mailnow = false;
        $discussion->course = $courseid;


        $discussionPersisted = forum_add_discussion($discussion);


        rebuild_course_cache($courseid);
    }

    /**
     *
     * @global type $DB
     * @global type $CFG
     * @param type $courseid
     * @return boolean
     */
    public static function addFeedbackForumToCourse($courseid, $forumName) {

        global $DB, $CFG;
        require_once($CFG->dirroot . "/mod/forum/lib.php");
        include_once($CFG->dirroot . "/course/lib.php");


        if (!$DB->get_record("forum", array('name' => $forumName, 'course' => $courseid))) {

            // create forum entry in moodle database
            $forum = new stdClass();
            $forum->course = $courseid;
            $forum->type = "general";
            $forum->timemodified = time();
            $forum->introformat = 2;
            $forum->timemodified = time();
            $forum->name = $forumName;
            $forum->intro = "Hier wird das Feedback aus der App gesammelt";
            $forum->id = $DB->insert_record("forum", $forum);

            if (!$module = $DB->get_record("modules", array("name" => "forum"))) {
                echo $OUTPUT->notification("Could not find forum module!!");
                return false;
            }

            //create course module entry
            $mod = new stdClass();
            $mod->course = $courseid;
            $mod->module = $module->id;
            $mod->instance = $forum->id;
            $mod->section = 0;
            if (!$mod->coursemodule = add_course_module($mod)) {   // assumes course/lib.php is loaded
                echo $OUTPUT->notification("Could not add a new course module to the course '" . $courseid . "'");
                return false;
            }
            if (!$sectionid = add_mod_to_section($mod)) {   // assumes course/lib.php is loaded
                echo $OUTPUT->notification("Could not add the new course module to that section");
                return false;
            }
            $DB->set_field("course_modules", "section", $sectionid, array("id" => $mod->coursemodule));
        }
    }

    public static function post_feedback($feedback) {

        global $DB, $CFG;
        include_once($CFG->dirroot . "/course/lib.php");

        $course = $DB->get_record('course', array('idnumber' => 'UPR1'));
        $courseid = $course->id;

        $forumName = "Feedback Forum";
        self::addFeedbackForumToCourse($courseid, $forumName);
        self::addFeedbackPostToForum($courseid, $forumName, $feedback);
        return array('result'=>true);
    }

    public static function post_feedback_parameters() {
        return new external_function_parameters(
                array('feedback' => new external_value(PARAM_TEXT, 'feedback')));
    }

    public static function post_feedback_returns() {
        return new external_single_structure(
                array(
            'result' => new external_value(PARAM_BOOL, 'Result flag'),
                )
        );
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.5
     */
    public static function get_calendar_reflection_events_returns() {
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
                    ), 'event')
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
                'timestart' => new external_value(PARAM_INT, "Time from which feedbacks should be returned", VALUE_DEFAULT, 0, NULL_ALLOWED),
                'timeend' => new external_value(PARAM_INT, "Time to which feedbacks should be returned", VALUE_DEFAULT, time(), NULL_ALLOWED)
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
        require_once($CFG->dirroot . "/mod/feedback/lib.php");

        $feedbacks = array();


        if (!$course = $DB->get_record('course', array('idnumber' => 'UPR1'))) {
            //TODO: error
        }


        $feedback_list = get_all_instances_in_course("feedback", $course, NULL, false);

        //file_put_contents("D:\output.txt", "Feedbacks: \n", FILE_APPEND);
        //file_put_contents("D:\output.txt", print_r($feedback_list, true)."\n", FILE_APPEND);

        foreach ($feedback_list as $id => $feedback_object) {

            if (feedback_is_already_submitted($feedback_object->id))
                continue;
            //TODO: Time und Caps beachten


            $feedbackitems = $DB->get_records('feedback_item', array('feedback' => $feedback_object->id));
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

                $questions[$item_id] = (array) $question;
            }


            $feedback = array(
                'name' => $feedback_object->name,
                'id' => $feedback_object->id,
                'questions' => $questions
            );

            $feedbacks[$id] = (array) $feedback;
        }

        //file_put_contents("D:\output.txt", "Feedbacks: \n", FILE_APPEND);
        //file_put_contents("D:\output.txt", print_r($feedbacks, true)."\n", FILE_APPEND);

        return array('feedbacks' => $feedbacks);
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.5
     */
    public static function get_feedbacks_returns() {
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
                        ), 'Question', VALUE_DEFAULT, array()
                        ), VALUE_DEFAULT, array()
                )
                    ), 'Feedback'
                    )
            )
                )
        );
    }

    /**
     * Returns description of method parameters
     *
     * @return external_function_parameters
     * @since Moodle 2.5
     */
    public static function submit_feedbacks_parameters() {
        return new external_function_parameters(
                array(
            'id' => new external_value(PARAM_INT, 'event id'),
            'answers' => ( new external_multiple_structure(
            new external_single_structure(
            array(
        'id' => new external_value(PARAM_INT, 'Question Id'),
        'answer' => new external_value(PARAM_TEXT, 'Answer Text'),
            ), 'Answers', VALUE_DEFAULT, array()
            )
            ))
                )
        );
    }

    /**
     * Get Fedback events
     * @package array $options various options
     * @return array Array of feedback details
     * @since Moodle 2.5
     */
    public static function submit_feedbacks($id = -1, $answers = array()) {

        global $SITE, $DB, $USER, $CFG;
        require_once($CFG->dirroot . "/mod/feedback/lib.php");

        $result = array();


        if (!$course = $DB->get_record('course', array('idnumber' => 'UPR1'))) {
            //TODO: error
        }

        $completed = new stdClass();
        $completed->feedback = $id;
        $completed->userid = $USER->id;
        $completed->guestid = false;
        $completed->timemodified = time();
        $completed->anonymous_response = 1;

        $completedid = $DB->insert_record('feedback_completed', $completed);
        $completed = $DB->get_record('feedback_completed', array('id' => $completedid));

        //tracking the submit
        $tracking = new stdClass();
        $tracking->userid = $USER->id;
        $tracking->feedback = $id;
        $tracking->completed = $completed->id;
        $DB->insert_record('feedback_tracking', $tracking);

        foreach ($answers as $item) {

            $value = new stdClass();
            $value->item = $item['id'];
            $value->completed = $completed->id;
            $value->course_id = $course->id;
            $value->value = $item['answer'];

            $DB->insert_record('feedback_value', $value);
        }

        $result['resultText'] = "Success";
        return $result;
    }

    /**
     * Returns description of method result value
     *
     * @return external_description
     * @since Moodle 2.5
     */
    public static function submit_feedbacks_returns() {
        return new external_single_structure(
                array(
            'resultText' => new external_value(PARAM_TEXT, 'Result Text'),
                )
        );
    }

}
