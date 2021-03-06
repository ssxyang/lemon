import axios from 'axios';
import * as Immutable from 'immutable';

export const FETCH_COURSES_REQUEST = 'FETCH_COURSES_REQUEST';
export const FETCH_COURSES_FAILURE = 'FETCH_COURSES_FAILURE';
export const FETCH_COURSES_SUCCESS = 'FETCH_COURSES_SUCCESS';

export const FETCH_COURSE_USERS_REQUEST = 'FETCH_COURSE_USERS_REQUEST';
export const FETCH_COURSE_USERS_FAILURE = 'FETCH_COURSE_USERS_FAILURE';
export const FETCH_COURSE_USERS_SUCCESS = 'FETCH_COURSE_USERS_SUCCESS';

export const ADD_COURSE_REQUEST = 'ADD_COURSE_REQUEST';
export const ADD_COURSE_FAILURE = 'ADD_COURSE_FAILURE';
export const ADD_COURSE_SUCCESS = 'ADD_COURSE_SUCCESS';

export const ENROLL_IN_COURSE_REQUEST = 'ENROLL_IN_COURSE_REQUEST';
export const ENROLL_IN_COURSE_FAILURE = 'ENROLL_IN_COURSE_FAILURE';
export const ENROLL_IN_COURSE_SUCCESS = 'ENROLL_IN_COURSE_SUCCESS';

export const UPDATE_COURSE_REQUEST = 'UPDATE_COURSE_REQUEST';
export const UPDATE_COURSE_FAILURE = 'UPDATE_COURSE_FAILURE';
export const UPDATE_COURSE_SUCCESS = 'UPDATE_COURSE_SUCCESS';

export const DELETE_COURSE_REQUEST = 'DELETE_COURSE_REQUEST';
export const DELETE_COURSE_FAILURE = 'DELETE_COURSE_FAILURE';
export const DELETE_COURSE_SUCCESS = 'DELETE_COURSE_SUCCESS';

function enrollInCourseRequest() {

	return {
		type: ENROLL_IN_COURSE_REQUEST
	};
}

function enrollInCourseSuccess(data) {

	return {
		type: ENROLL_IN_COURSE_SUCCESS,
		request: data
	};
}

function enrollInCourseFailure(error) {

	return {
		type: ENROLL_IN_COURSE_FAILURE,
		payload: {error: error}
	};
}

export function enrollInCourse(user_id, course_id) {
	return dispatch => {
		dispatch(enrollInCourseRequest());

		return axios.post('/api/v1/users/courses', {
			user_id: user_id,
			course_id: course_id
		})
		.then(res => {
			console.log('adding user course success!');
			dispatch(enrollInCourseSuccess(res.data));		
		})
		.catch(err => {
			console.log('adding user course failure!');
			dispatch(enrollInCourseFailure(err));	
		});
	}	
}


function fetchCoursesRequest() {

	return {
		type: FETCH_COURSES_REQUEST
	};
}

function fetchCoursesSuccess(data) {
	let coursesList = Immutable.List();
	let coursesById = Immutable.Map();
	data.forEach(function(item) {
		if (coursesById.get(item.id) === undefined ) {
			coursesList = coursesList.push(item.id);
			coursesById = coursesById.set(item.id, Immutable.Map({
				id: item.id,
				body_params: Immutable.Map({
					title: item.title,
					source: item.source,
					link: item.course_link,
					chat_link: item.chat_link,
					img: item.image,
					list: Immutable.List(),
					description: item.description
				})
			}));
		}	
	});

	const request = {
		coursesList: coursesList,
		coursesById: coursesById
	};

	return {
		type: FETCH_COURSES_SUCCESS,
		payload: request
	};
}

function fetchCoursesFailure(error) {

	return {
		type: FETCH_COURSES_FAILURE,
		payload: {error: error}
	};
}

export function fetchCourses() {
	return dispatch => {
		dispatch(fetchCoursesRequest());

		return axios.get('/api/v1/courses')
		.then(res => {
			console.log('fetching courses success!');
			dispatch(fetchCoursesSuccess(res.data));		
		})
		.catch(err => {
			console.log('fetching courses failure!');
			dispatch(fetchCoursesFailure(err));	
		});
	}	
}

function fetchCourseUsersRequest() {

	return {
		type: FETCH_COURSE_USERS_REQUEST
	};
}

function fetchCourseUsersSuccess(data, id) {
	let list = Immutable.List();
	data.forEach(function(item) {
		list = list.push(item.user_id);
	});

	const request = {
		courseId: id,
		list: list
	};

	return {
		type: FETCH_COURSE_USERS_SUCCESS,
		payload: request
	};
}

function fetchCourseUsersFailure(error) {

	return {
		type: FETCH_COURSE_USERS_FAILURE,
		payload: {error: error}
	};
}

export function fetchCourseUsers(id) {
	return dispatch => {
		dispatch(fetchCourseUsersRequest());

		return axios.get('/api/v1/courses/users/'+id)
		.then(res => {
			dispatch(fetchCourseUsersSuccess(res.data, id));		
		})
		.catch(err => {
			dispatch(fetchCourseUsersFailure(err));	
		});
	}	
}

function addCourseRequest() {

	return {
		type: ADD_COURSE_REQUEST
	};
}

function addCourseSuccess(data) {
	const request = {
		id: data.id,
		body_params: {
			title: data.title,
			source: data.source,
			link: data.course_link,
			img: data.image,
			list: [],
			description: data.description
		}
	};

	return {
		type: ADD_COURSE_SUCCESS,
		payload: request
	};
}

function addCourseFailure(error) {

	return {
		type: ADD_COURSE_FAILURE,
		payload: {error: error}
	};
}

export function addCourse(title, room, source, link, img, description) {
	return dispatch => {
		dispatch(addCourseRequest());

		return axios.post('/api/v1/courses', {
			title: title,
			source: source,
			description: description,
			image: img,
			course_link: link,
			chat_link: 'https://gitter.im/ML-LIME/'+room
		})
		.then(res => {
			console.log('adding course success!');
			dispatch(addCourseSuccess(res.data));		
		})
		.catch(err => {
			console.log('adding course failure!');
			dispatch(addCourseFailure(err));	
		});
	}	
}

function updateCourseRequest(id) {

	return {
		type: UPDATE_COURSE_REQUEST,
		payload: {id: id}
	};
}

function updateCourseSuccess(data) {
	const request = {
		id: data.id,
		body_params: {
			title: data.title,
			source: data.source,
			link: data.course_link,
			img: data.image,
			list: [],
			description: data.description
		}
	};

	return {
		type: UPDATE_COURSE_SUCCESS,
		payload: request
	};
}

function updateCourseFailure(error) {

	return {
		type: UPDATE_COURSE_FAILURE,
		payload: {error: error}
	};
}

export function updateCourse(id, title, source, link, img, list, description) {
	return dispatch => {
		dispatch(updateCourseRequest());

		return axios.put(`/api/v1/courses/${id}`, {
			title: title,
			source: source,
			description: description,
			image: img,
			course_link: link,
			chat_link: link
		})
		.then(res => {
			console.log('updating course success!');
			dispatch(updateCourseSuccess(res.data));		
		})
		.catch(err => {
			console.log('updating course failure!');
			dispatch(updateCourseFailure(err));	
		});
	}	
}

function deleteCourseRequest(id) {

	return {
		type: DELETE_COURSE_REQUEST,
		payload: {id: id}
	};
}

function deleteCourseSuccess(data) {
	const request = {
		id: data.id,
	};

	return {
		type: DELETE_COURSE_SUCCESS,
		payload: request
	};
}

function deleteCourseFailure(error) {

	return {
		type: DELETE_COURSE_FAILURE,
		payload: {error: error}
	};
}

export function deleteCourse(id) {
	return dispatch => {
		dispatch(deleteCourseRequest());

		return axios.delete(`/api/v1/courses/${id}`)
		.then(res => {
			console.log('deleting course success!');
			dispatch(deleteCourseSuccess(res.data));		
		})
		.catch(err => {
			console.log('deleting course failure!');
			dispatch(deleteCourseFailure(err));	
		});
	}	
}
