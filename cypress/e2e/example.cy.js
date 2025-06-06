// https://on.cypress.io/api
describe.skip('Validacion Ventana Inicial', () => {
  it('La prueba deberá de validar que la ventana cuenta con el título de la aplicación así como los textos correspondientes', () => {
    cy.visit('http://localhost:5173/')

    cy.get('img[src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"]').should('exist')

    cy.contains('h2', '¿Eres el mejor maestro pokemon del mundo?').should('exist')

    cy.contains('h3', 'Encuentra todos los pokemons ocultos y demuestralo!!').should('exist')

    cy.contains('h1', 'Instrucciones:').should('exist')

    cy.contains('p', 'Para mostrar al pokemon detrás del Ditto da click en el pokemon deseado, después elige otra opción para encontrar el par').should('exist')

    cy.contains('p', 'Una vez que hayas encontrado todos los pares, el juego te mostrará tu puntaje').should('exist')
  })

  it('Debe permitir escribir nombre de usuario y hacer clic en Registro/Ingreso', () => {
    cy.visit('http://localhost:5173/')

    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]')
      .should('exist')
      .type('El Primo')

    cy.contains('button', 'Registro/Ingreso')
      .should('be.visible')
      .click()

    cy.contains('h2', 'Región')
      .should('exist')

    cy.get('.option')
      .should('have.length.at.least', 1)

    cy.contains('.option', 'Kanto')
      .click()
      .should('have.class', 'active')

    cy.contains('h2', 'Dificultad')
      .should('exist')

    cy.contains('.option', 'Fácil')
      .click()
      .should('have.class', 'active')

    cy.contains('button', '¡Comenzar!')
      .should('exist')
      .and('be.visible')
  })

  it('Debe navegar a la pantalla de juego y mostrar los datos del jugador', () => {
  cy.visit('http://localhost:5173/')

  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]')
    .type('El Primo')

  cy.contains('button', 'Registro/Ingreso').click()

  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()

  cy.contains('button', '¡Comenzar!').click()

  cy.url().should('include', '/game')

  cy.get('[data-testid="player-name"]').should('contain', 'El Primo')
  cy.get('[data-testid="player-region"]').should('contain', 'Kanto')
  cy.get('[data-testid="player-difficulty"]').should('contain', 'Fácil')
})
})

describe('Memorama Pokémon - flujo completo desde Home hasta Game', () => {

  it('1. Permite ingresar nombre, seleccionar región y dificultad, y comenzar juego', () => {
    cy.visit('http://localhost:5173/')

    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]')
      .should('exist')
      .type('El Primo')

    cy.contains('button', 'Registro/Ingreso')
      .should('be.visible')
      .click()

    // Seleccionar región
    cy.contains('h2', 'Región').should('exist')
    cy.get('.option').should('have.length.at.least', 1)
    cy.contains('.option', 'Kanto')
      .click()
      .should('have.class', 'active')

    // Seleccionar dificultad
    cy.contains('h2', 'Dificultad').should('exist')
    cy.contains('.option', 'Fácil')
      .click()
      .should('have.class', 'active')

    cy.contains('button', '¡Comenzar!')
      .should('exist')
      .and('be.visible')
      .click()
    
    cy.url().should('include', '/game')
  })

// PRUEBA 2: Verificar que cartas diferentes se voltean de vuelta
it('2. Al hacer clic en dos cartas distintas se voltean y luego se ocultan si no coinciden', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  cy.url().should('include', '/game')
  
  const cardMap = new Map()
  cy.get('.card').each(($card, index) => {
    cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
      if (!src.includes('132.png')) {
        if (cardMap.has(src)) {
          cardMap.get(src).push(index)
        } else {
          cardMap.set(src, [index])
        }
      }
    })
  }).then(() => {
    cy.wait(3500)
    const entries = Array.from(cardMap.entries())
    
    // Buscar dos cartas con imágenes diferentes
    let differentPair = []
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        if (entries[i][0] !== entries[j][0]) { // Imágenes diferentes
          differentPair = [entries[i][1][0], entries[j][1][0]]
          break
        }
      }
      if (differentPair.length > 0) break
    }
    
    // Hacer clic en las dos cartas diferentes
    cy.get('.card').eq(differentPair[0]).click()
    cy.wait(600)
    cy.get('.card').eq(differentPair[1]).click()
    cy.wait(1500)
    
    // Verificar que ambas cartas se volvieron a ocultar
    cy.get('.card').eq(differentPair[0]).find('img').should('have.attr', 'src').and('include', '132.png')
    cy.get('.card').eq(differentPair[1]).find('img').should('have.attr', 'src').and('include', '132.png')
  })
})

// PRUEBA 3: Verificar que cartas iguales permanecen volteadas
it('3. Si las dos cartas volteadas coinciden, permanecen volteadas y no se ocultan', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  cy.url().should('include', '/game')
  
  const cardMap = new Map()
  cy.get('.card').each(($card, index) => {
    cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
      if (!src.includes('132.png')) {
        if (cardMap.has(src)) {
          cardMap.get(src).push(index)
        } else {
          cardMap.set(src, [index])
        }
      }
    })
  }).then(() => {
    cy.wait(3500)
    const pairs = Array.from(cardMap.entries()).filter(([, positions]) => positions.length === 2)
    
    // Tomar el primer par encontrado
    const [imageSrc, [pos1, pos2]] = pairs[0]
    
    // Hacer clic en las dos cartas iguales
    cy.get('.card').eq(pos1).click()
    cy.wait(600)
    cy.get('.card').eq(pos2).click()
    cy.wait(1500)
    
    // Verificar que ambas cartas permanecen volteadas
    cy.get('.card').eq(pos1).find('img').should('have.attr', 'src').and('eq', imageSrc)
    cy.get('.card').eq(pos2).find('img').should('have.attr', 'src').and('eq', imageSrc)
  })
})
})


describe('RankView - Tabla de Posiciones', () => {
it('1. Debe mostrar correctamente todos los elementos de la pantalla de puntuación', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  cy.url().should('include', '/game')
  
  // Completar el juego
  const cardMap = new Map()
  cy.get('.card').each(($card, index) => {
    cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
      if (!src.includes('132.png')) {
        if (cardMap.has(src)) {
          cardMap.get(src).push(index)
        } else {
          cardMap.set(src, [index])
        }
      }
    })
  }).then(() => {
    cy.wait(3500)
    const pairs = Array.from(cardMap.entries()).filter(([, positions]) => positions.length === 2)
    
    const resolvePairs = (index = 0) => {
      if (index >= pairs.length) return
      const [, [pos1, pos2]] = pairs[index]
      cy.get('.card').eq(pos1).click()
      cy.wait(600)
      cy.get('.card').eq(pos2).click()
      cy.wait(1400)
      if (index + 1 < pairs.length) {
        resolvePairs(index + 1)
      }
    }
    
    resolvePairs()
    cy.url({ timeout: 10000 }).should('include', '/score')
    
    // VALIDACIONES DE SCOREVIEW
    
    // Verificar título principal
    cy.contains('h1', '¡Ganaste!').should('be.visible')
    
    // Verificar que aparece el nombre del jugador
    cy.contains('.nombre', 'El Primo').should('be.visible')
    
    // Verificar texto de resultado
    cy.contains('lo logró en').should('be.visible')
    cy.contains('intentos').should('be.visible')
    
    // Verificar que ambos botones están presentes
    cy.contains('button', 'Volver al Menú').should('be.visible')
    cy.contains('button', 'Tabla de Posiciones').should('be.visible')
    
    // Probar funcionalidad del botón "Tabla de Posiciones"
    cy.contains('button', 'Tabla de Posiciones').click()
    cy.url().should('include', '/rank')
    
    // Regresar para probar el otro botón
    cy.go('back')
    cy.url().should('include', '/score')
  })
})

  it('2. Debe mostrar correctamente todos los elementos de la tabla de posiciones', () => {
    // Ejecutar el juego primero para tener datos
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()
    cy.url().should('include', '/game')
    
    // Completar el juego (usando tu código que funciona)
    const cardMap = new Map()
    cy.get('.card').each(($card, index) => {
      cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
        if (!src.includes('132.png')) {
          if (cardMap.has(src)) {
            cardMap.get(src).push(index)
          } else {
            cardMap.set(src, [index])
          }
        }
      })
    }).then(() => {
      cy.wait(3500)
      const pairs = Array.from(cardMap.entries()).filter(([, positions]) => positions.length === 2)
      
      const resolvePairs = (index = 0) => {
        if (index >= pairs.length) return
        const [, [pos1, pos2]] = pairs[index]
        cy.get('.card').eq(pos1).click()
        cy.wait(600)
        cy.get('.card').eq(pos2).click()
        cy.wait(1400)
        if (index + 1 < pairs.length) {
          resolvePairs(index + 1)
        }
      }
      
      resolvePairs()
      cy.url({ timeout: 10000 }).should('include', '/score')
      cy.contains('button', 'Tabla de Posiciones').click()
      cy.url().should('include', '/rank')
      
      // VALIDACIONES ESPECÍFICAS DE RANKVIEW
      
      // Verificar título principal
      cy.contains('h1', 'Tabla de Posiciones').should('be.visible')
      
      // Verificar filtro de dificultad
      cy.get('.filtro-modo').should('be.visible')
      cy.get('.filtro-modo label').should('contain.text', 'Filtrar por dificultad:')
      cy.get('select#modo').should('exist').and('be.visible')
      
      // Verificar opciones del select
      cy.get('select#modo option').should('have.length', 4) // Todos, Fácil, Medio, Difícil
      cy.get('select#modo option').eq(0).should('contain.text', 'Todos')
      cy.get('select#modo option').eq(1).should('contain.text', 'Fácil')
      cy.get('select#modo option').eq(2).should('contain.text', 'Medio')
      cy.get('select#modo option').eq(3).should('contain.text', 'Difícil')
      
      // Verificar estructura de la tabla
      cy.get('.tabla').should('be.visible')
      cy.get('.tabla thead tr th').should('have.length', 5)
      
      // Verificar encabezados específicos
      cy.get('.tabla thead tr th').eq(0).should('contain.text', '#')
      cy.get('.tabla thead tr th').eq(1).should('contain.text', 'Nombre')
      cy.get('.tabla thead tr th').eq(2).should('contain.text', 'Intentos')
      cy.get('.tabla thead tr th').eq(3).should('contain.text', 'Modo')
      cy.get('.tabla thead tr th').eq(4).should('contain.text', 'Región')
      
      // Verificar que hay al menos una fila con datos
      cy.get('.tabla tbody tr').should('have.length.at.least', 1)
      
      // Verificar que el jugador actual aparece en la tabla
      cy.get('.tabla tbody tr').should('contain.text', 'El Primo')
      cy.get('.tabla tbody tr').should('contain.text', 'Fácil')
      cy.get('.tabla tbody tr').should('contain.text', 'Kanto')
      
      // Verificar botón volver
      cy.get('.boton').should('be.visible').and('contain.text', 'Volver')
    })
  })

  // PRUEBA 3: Validar navegación y comportamiento del botón "Volver"
  it('3. Debe navegar correctamente de vuelta a ScoreView', () => {
    // Completar un juego para llegar a RankView
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()
    cy.url().should('include', '/game')
    
    const cardMap = new Map()
    cy.get('.card').each(($card, index) => {
      cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
        if (!src.includes('132.png')) {
          if (cardMap.has(src)) {
            cardMap.get(src).push(index)
          } else {
            cardMap.set(src, [index])
          }
        }
      })
    }).then(() => {
      cy.wait(3500)
      const pairs = Array.from(cardMap.entries()).filter(([, positions]) => positions.length === 2)
      
      const resolvePairs = (index = 0) => {
        if (index >= pairs.length) return
        const [, [pos1, pos2]] = pairs[index]
        cy.get('.card').eq(pos1).click()
        cy.wait(600)
        cy.get('.card').eq(pos2).click()
        cy.wait(1400)
        if (index + 1 < pairs.length) {
          resolvePairs(index + 1)
        }
      }
      
      resolvePairs()
      cy.url({ timeout: 10000 }).should('include', '/score')
      
      // VALIDAR SCOREVIEW ANTES DE IR A RANKVIEW
      cy.contains('h1', '¡Ganaste!').should('be.visible')
      cy.contains('h2', 'El Primo').should('be.visible')
      cy.contains('h2', 'intentos').should('be.visible')
      
      // Ir a RankView
      cy.contains('button', 'Tabla de Posiciones').click()
      cy.url().should('include', '/rank')
      
      // Verificar que estamos en RankView
      cy.contains('h1', 'Tabla de Posiciones').should('be.visible')
      cy.get('.tabla').should('be.visible')
      
      // PROBAR NAVEGACIÓN DE VUELTA
      cy.contains('button', 'Volver').should('be.visible').click()
      
      // Verificar que regresamos a ScoreView
      cy.url().should('include', '/score')
      cy.contains('h1', '¡Ganaste!').should('be.visible')
      cy.contains('h2', 'El Primo').should('be.visible')

      // Verificar que los botones de ScoreView siguen funcionando
      cy.contains('button', 'Volver al Menú').should('be.visible')
      cy.contains('button', 'Tabla de Posiciones').should('be.visible')
      
      // Probar ir de nuevo a RankView para confirmar que la navegación es bidireccional
      cy.contains('button', 'Tabla de Posiciones').click()
      cy.url().should('include', '/rank')
      cy.contains('h1', 'Tabla de Posiciones').should('be.visible')
      
      // Probar navegación múltiple
      cy.contains('button', 'Volver').click()
      cy.url().should('include', '/score')
      cy.contains('button', 'Tabla de Posiciones').click()
      cy.url().should('include', '/rank')
      
      // Verificar que los datos siguen siendo consistentes después de múltiples navegaciones
      cy.get('.tabla tbody tr').should('contain.text', 'El Primo')
      cy.get('.tabla tbody tr').should('contain.text', 'Fácil')
      cy.get('.tabla tbody tr').should('contain.text', 'Kanto')
    })
  })
})