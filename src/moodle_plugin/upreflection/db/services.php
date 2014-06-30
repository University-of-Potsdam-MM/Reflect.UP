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
 * Web service local plugin template external functions and service definitions.
 *
 * @package    upreflection
 * @copyright  2014 Bjoern Groneberg
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// We defined the web service functions to install.
$functions = array(
        'local_upreflection_get_calendar_entries' => array(
                'classname'   => 'local_reflection_external',
                'methodname'  => 'get_calendar_reflection_events',
                'classpath'   => 'local/upreflection/externallib.php',
                'description' => 'Returns the calendar entries of the Reflection course',
                'type'        => 'read',
        ),
        'local_upreflection_get_feedbacks' => array(
                'classname'   => 'local_reflection_external',
                'methodname'  => 'get_feedbacks',
                'classpath'   => 'local/upreflection/externallib.php',
                'description' => 'Returns the feedback entries of the Reflection course',
                'type'        => 'read',
        ),
        'local_upreflection_submit_feedbacks' => array(
                'classname'   => 'local_reflection_external',
                'methodname'  => 'submit_feedbacks',
                'classpath'   => 'local/upreflection/externallib.php',
                'description' => 'Submits the feedback values for the Reflection course',
                'type'        => 'write',
        )
);

// We define the services to install as pre-build services. A pre-build service is not editable by administrator.
$services = array(
        'UPReflection Service' => array(
                'functions' => array (
                        'local_upreflection_get_calendar_entries', 
                        'local_upreflection_get_feedbacks',
                        'local_upreflection_submit_feedbacks'
                        ),
                'restrictedusers' => 0,
                'enabled'=>1,
                'shortname'=>'upreflection',
        )
);