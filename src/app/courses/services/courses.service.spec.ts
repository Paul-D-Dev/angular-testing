import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should retrieve all courses', () => {
    // Test data mock comes from /server/db-data.ts
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'incorrect number of courses');

      const course = courses.find((c) => c.id === 12);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const request = httpTestingController.expectOne('/api/courses');
    expect(request.request.method).toEqual('GET');

    // flush take the form of api response http://localhost:9000/api/courses
    // payload: Courses[]
    // simulate the response api
    request.flush({ payload: Object.values(COURSES) });
  });

  it('should find a course by id', () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');
    req.flush(COURSES[12]);
  });

  it('should save the course data', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing course',
      },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );
    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {
      titles: {
        description: 'Testing course',
      },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail('Save course should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('PUT');

    req.flush('Save course failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should find a list of lessons', () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (request) => request.url === '/api/lessons'
    );
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual('12');
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    // Prevent that further requests are being accidentally made by httpTestingController
    httpTestingController.verify();
  });
});
