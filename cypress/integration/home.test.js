describe('Home Page', () => {
  it('should display a list of courses', () => {

    // Load mock response api/courses
    cy.fixture('courses.json').as('coursesJson');

    // Start fake server
    cy.server();
    // Route to api/courses, using data from file coursesJson
    cy.route('/api/courses', '@coursesJson').as('courses');
    cy.visit('/');
    cy.contains('All Courses');

    // Wait the response completed
    cy.wait('@courses');
    // Check if we got courses beginners (9)
    cy.get('mat-card').should('have.length', 9);

  });


})
