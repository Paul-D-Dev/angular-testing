import { fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

fdescribe('Async examples', () => {
  it('Async test example with Jasmine Done', (done) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('Async test example - fakeAsync tick', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions setTimeout()');
      test = true;
    }, 1000);
    /* Also works
    * tick(500)
    * tick(499)
    * tick(1)
    * */
    tick(1000);
    expect(test).toBeTruthy();
  }));

  it('Async test example - fakeAsync flush', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions setTimeout() 2000');
      test = true;
    }, 2000);

    setTimeout(() => {
      console.log('running assertions setTimeout() 1000');
      test = true;
    }, 1000);

    // flush wait all set are finished
    flush();
    expect(test).toBeTruthy();
  }));

  // Promises got priority over macroTasks (set, click, animations)
  it('Async test example - plain Promise', fakeAsync(() => {
    let test = false;
    console.log('Create promise');

    // MacroTask is launched after microTasks
    /*
    setTimeout(() => {
      console.log('setTimeout first callBack triggered.');
    });
    setTimeout(() => {
      console.log('setTimeout second callBack triggered.');
    });*/

    // MicroTasks is launched first
    Promise.resolve()
      .then(() => {
        console.log('Promise first then() evaluated successfully');
        test = true;
        return Promise.resolve();
      })
      .then(() => {
        console.log('Promise second then() evaluated successfully');
      });
    flushMicrotasks();
    console.log('Running test assertions');

    expect(test).toBeTruthy();
  }));

  it('Async test example - Promises + setTimeout', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

    expect(counter).toBe(0);

    flushMicrotasks();
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(11);

  }));

  it('Async test example - Observable 1', () => {
    let test = false;
    console.log('Creating Observable');

    // Synchronous observable
    const test$ = of(test);

    test$.subscribe(() => {
      test = true;
    });

    console.log('Running test assertions');
    expect(test).toBe(true);
  });


  fit('Async test example - Observable 2', fakeAsync(() => {
    let test = false;
    console.log('Creating Observable');

    // Asynchronous observable
    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log('Running test assertions');
    expect(test).toBe(true);
  }));
});


