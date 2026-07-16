describe('Flujo de Agenda Médica - Test E2E', () => {
  it('Debería iniciar sesión correctamente y visualizar un turno en la agenda', () => {
    cy.viewport(1920, 1080);
    
    cy.visit('https://prueba-dds.duckdns.org/')

    cy.get('[aria-label="Abrir menú de usuario"]')
      .should('be.visible')
      .click();

    cy.contains("label", "Usuario")
      .parent()
      .find("input")
      .type("sapo_milk", { force: true });

    cy.contains("label", "Contraseña")
      .parent()
      .find("input")
      .type("sapo_milk", { force: true });

    cy.contains("button", "Iniciar sesión").click();

    cy.url().should('include', '/medicoHome'); 

    cy.contains('a.medico-link', 'Agenda')
      .should('be.visible')
      .click();

    cy.url().should('include', '/agenda');

    cy.get('.rbc-event')
      .contains('Radiografía')
      .should('be.visible')
      .click();
    
    cy.contains('.turno-dialog-title', 'Detalles del Turno')
      .should('be.visible');

    cy.get('input[type="datetime-local"]')
      .should('be.visible')
      .type('2026-10-20T10:00');

    cy.contains('button', 'Proponer cambio')
      .should('be.enabled')
      .click();

    cy.get('.turno-dialog-paper')
      .should('not.exist');
  })
})