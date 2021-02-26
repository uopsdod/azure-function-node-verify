const axios = require('axios');
const asyncPool = require('tiny-async-pool');

const sendPostRequest = () => {
    return new Promise((resolve, reject) => {
        try {
            const url = 'https://functionappnode.azurewebsites.net/api/HttpTrigger?code=kfXxf3nRq4XN7RyNl0FYQoMLtuCLMFtCV0cayt3/tC5j48bv0y2imA==';
            var body_json = {
                "data": [
                    {
                        "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1",
                        "action": "Viewed",
                        "actor": {
                            "id": "https://theproject.zone/user/xinwenl@andrew.cmu.edu",
                            "name": "xinwenl@andrew.cmu.edu",
                            "type": "Person"
                        },
                        "edApp": {
                            "description": "Central database and user interface for SAIL",
                            "id": "https://github.com/CloudComputingCourse/theproject.zone",
                            "name": "theproject.zone",
                            "type": "SoftwareApplication",
                            "version": "master"
                        },
                        "eventTime": "2020-09-06T04:00:00.772193",
                        "extensions": {
                            "heartbeat": true
                        },
                        "group": {
                            "academicSession": "f20",
                            "courseNumber": "15619",
                            "dateCreated": "2020-02-10T18:53:30.035124+00:00",
                            "dateModified": "2020-08-03T00:29:26.668331+00:00",
                            "description": "Graduate instance of the cloud computing course",
                            "extensions": {
                                "end_time": "2020-12-12T03:59:59+00:00",
                                "open_access": false,
                                "requires_research_agreement": true,
                                "start_time": "2020-05-18T05:00:00+00:00"
                            },
                            "id": "https://theproject.zone/course/f20-15619",
                            "name": "F20 15-619 Cloud Computing",
                            "subOrganizationOf": {
                                "dateCreated": "2016-08-23T16:30:02.696999+00:00",
                                "dateModified": "2019-12-05T19:55:02.383192+00:00",
                                "description": "This on-line course gives students an overview of the field of Cloud Computing, its enabling technologies, main building blocks, and hands-on experience through projects utilizing public clouds",
                                "id": "https://theproject.zone/course_group/1",
                                "name": "Cloud Computing",
                                "type": "CourseOffering"
                            },
                            "type": "CourseOffering"
                        },
                        "id": "urn:uuid:85776ce3-075c-41a9-998d-be9817354891",
                        "object": {
                            "creators": [
                                {
                                    "id": "https://theproject.zone/user/eedavis@andrew.cmu.edu",
                                    "name": "eedavis@andrew.cmu.edu",
                                    "type": "Person"
                                }
                            ],
                            "dateToActivate": "2020-08-31T04:00:00+00:00",
                            "dateToSubmit": "2020-09-07T03:59:59+00:00",
                            "description": "Amazon Web Services",
                            "extensions": {
                                "assesmes_enabled": true,
                                "module_type": false,
                                "team_formation_enabled": false
                            },
                            "id": "https://theproject.zone/module/1621/aws-intro",
                            "isPartOf": "https://theproject.zone/project/287",
                            "maxScore": 80.0,
                            "mediaType": "text/markdown",
                            "name": "Amazon Web Services Intro",
                            "type": "AssignableDigitalResource"
                        },
                        "referrer": "https://theproject.zone/f20-15619/aws-intro",
                        "session": "urn:key:9v581hq6zfp985c8vl802cwiiielxym6",
                        "type": "ViewEvent"
                    }
                ],
                "dataVersion": "http://purl.imsglobal.org/ctx/caliper/v1p1",
                "sendTime": "2020-09-06T04:00:00.777Z",
                "sensor": "http://theproject.zone/caliper/",
                "sailCourseSlug": "f20-11619"
            }
            const resp = axios.post(url, body_json);
            // console.log(resp.data);
            resolve(resp);
        } catch (err) {
            // Handle Error Here
            console.error(err);
            reject(err);
        }
    });
};

const sendMultiPostRequest = () => {
    return new Promise((resolve, reject) => {
        try {
            var resp = sendPostRequest();
            resp = sendPostRequest();
            console.log(resp.data);
            resolve(resp);
        } catch (err) {
            // Handle Error Here
            console.error(err);
            reject(err);
        }
    });    
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const concurrent_count = (req.query.concurrent_count)?req.query.concurrent_count:1;

    // http request for pressure testing (on-going)
    // const resp = await sendPostRequest();

    var start = new Date();

    // pressure test 
    var promises = [];
    for (var i = 0; i < concurrent_count ;i++) {
        promises.push(sendPostRequest());
    }

    // wait for all requestare done 
    const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
    const pool_concurrent_limit = concurrent_count;
    const resp2 = await asyncPool(pool_concurrent_limit, promises, timeout);

    // var resp2 = await Promise.all(promises);

    var end = new Date();
    var diff = (end - start) / 1000; // seconds interval

    context.res = {
        body: {
            concurrent_count: concurrent_count,
            proccess_time_in_second: diff
        }
    };
}