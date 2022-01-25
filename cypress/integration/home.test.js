describe('Home Page', () => {

  // Refactor common part
  beforeEach(() => {
    // Load mock response api/courses
    cy.fixture('courses.json').as('coursesJson');

    // Start fake server
    cy.server();
    // Route to api/courses, using data from file coursesJson
    cy.route('/api/courses', '@coursesJson').as('courses');
    cy.visit('/');
  })
  it('should display a list of courses', () => {
    cy.contains('All Courses');

    // Wait the response completed
    cy.wait('@courses');
    // Check if we got beginners courses (9)
    cy.get('mat-card').should('have.length', 9);
  });

  it('should display the advanced courses', () => {
    const tabs = cy.get('.mat-tab-label');
    // Check tabs
    tabs.should('have.length', 2);

    // Simulate click on Advanced tab
    tabs.last().click();

    // Count how much title and check first title value
    cy.get('.mat-tab-body-active .mat-card-title')
      .its('length')
      .should('be.gt',1);

    cy.get('.mat-tab-body-active .mat-card-title')
      .first()
      .should('contain', 'Angular Security Course')
  });


})
