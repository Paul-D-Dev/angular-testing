import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { COURSES } from '../../../../server/db-data';
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

  afterEach(() => {
    // Prevent that further requests are being accidentally made by httpTestingController
    httpTestingController.verify();
  });
});
