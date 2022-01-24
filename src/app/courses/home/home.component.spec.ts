import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { setupCourses } from '../common/setup-test-data';
import { click } from '../common/test-utils';
import { CoursesModule } from '../courses.module';
import { CoursesService } from '../services/courses.service';

import { HomeComponent } from './home.component';

// This component contains others component is called component container
// Data come from observables

fdescribe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginnerCourses = setupCourses().filter(
    (course) => course.category === 'BEGINNER'
  );
  const advancedCourses = setupCourses().filter(
    (course) => course.category === 'ADVANCED'
  );

  beforeEach(
    waitForAsync(() => {
      const coursesServiceSpy = jasmine.createSpyObj('CoursesService', [
        'findAllCourses',
      ]);
      TestBed.configureTestingModule({
        imports: [
          CoursesModule,
          NoopAnimationsModule, // deactivate operation animation but it's not break mat anim
        ],
        providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(HomeComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement;
          coursesService = TestBed.inject<CoursesService>(CoursesService);
        });
    })
  );

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display only beginner courses', () => {
    // return an Observable courses
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(
      1,
      'Unexpected number of tabs found : ' + tabs.length
    );
  });

  it('should display only advanced courses', () => {
    // return an Observable courses
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(
      1,
      'Unexpected number of tabs found : ' + tabs.length
    );
  });

  it('should display both tabs', () => {
    // return an Observable courses
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, 'Expected to find 2 tabs');
  });

  // Asynchronous Test because of animation when user clicks on second tab
  it('use DONE should display advanced courses when tab clicked', (done) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // Simulate click interaction
    click(tabs[1]);
    fixture.detectChanges();

    setTimeout(() => {
      const cardTitles = el.queryAll(
        By.css('.mat-tab-body-active .mat-card-title')
      );
      expect(cardTitles.length).toBeGreaterThan(
        0,
        'Could not find cart titles'
      );

      expect(cardTitles[0].nativeElement.textContent).toContain(
        'Angular Security Course',
        'Not same title'
      );

      done();
    }, 500);
  });

  it('use FakeAsync should display advanced courses when tab clicked', fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mat-tab-label'));

    // Simulate click interaction
    click(tabs[1]);
    fixture.detectChanges();

    flush();
    // tick(16) also works 16ms is equal animation's time

    const cardTitles = el.queryAll(
      By.css('.mat-tab-body-active .mat-card-title')
    );
    expect(cardTitles.length).toBeGreaterThan(
      0,
      'Could not find cart titles'
    );

    expect(cardTitles[0].nativeElement.textContent).toContain(
      'Angular Security Course',
      'Not same title'
    );
  }));
});
