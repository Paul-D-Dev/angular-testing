import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoursesModule } from '../courses.module';
import { CoursesService } from '../services/courses.service';

import { HomeComponent } from './home.component';

// This component contains others component is called component container
// Data come from observables

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;

  beforeEach(() => {
    const coursesServiceSpy = jasmine.createSpyObj('CourseService', [
      'findAllCourses',
    ]);
    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule, // deactivate operation animation but it's not break mat anim
      ],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceSpy,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display only beginner courses', () => {
    pending();
  });

  it('should display only advanced courses', () => {
    pending();
  });

  it('should display both tabs', () => {
    pending();
  });

  it('should display advanced courses when tab clicked', () => {
    pending();
  });
});
