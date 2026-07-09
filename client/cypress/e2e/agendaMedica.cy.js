describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')

    cy.get('[aria-label="Abrir menú de usuario"]')
      .scrollIntoView()
      .click();

    cy.contains("label", "Usuario")
      .parent()
      .find("input")
      .type("sapo_milk");

    cy.contains("label", "Contraseña")
      .parent()
      .find("input")
      .type("sapo_milk");

    cy.contains("button", "Iniciar sesión").click();

    cy.contains('.rbc-event', 'Pediatría')
      .click();

    cy.contains('')
  })
})