
## Angular Unit Test / E2e

# Context
In order to improve my skills in Angular. 
I followed a MOOC to learn unit test and E2E test.

I applied tests to an existing project.
I am testing components, services and home page. To unit test components, I mocked the injected
service because I wanted to test only the component and not his dependencies.

In service, I am tested http request GET, POST, PUT with HttpTestingController and I used the
API's function flush() to mock the response.

In E2E tests, I am tested home component. In this case, I mocked his dependence service, then I
imported modules. I applied synchronous and asynchronous tests, I simulated user's click and checked changing data.

# Tasks done
* Unit tests (component, service)
* Use Jasmine to create spy object
* Function TestBed to configure testing module, inject service, create component
* Simulate user's interactions
* Testing Observables, Http Requests
* Select specific element from DOM
* Mock http responses then update data with detectChanges()
* Synchronous and asynchronous tests (done, tick(), fakeAsync, flush(), waitForAsync, whenStable())
* E2E Test with Cypress (display home page '/', get Data from Json file and save it in alias, call API route, wait(), select DOM's element, simulate user's interaction, check changing data)



# Stacks
* Angular 13
* Typescript
* Karma
* Jasmine
* Cypress
* Git Hub
