// https://on.cypress.io/api
describe('Validacion Ventana Inicial', () => {
  it('Debe de validar que la ventana cuenta con el titulo y los textos', () => {
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

  // Comprobar que se esten pasando bien los datos del jugador
  cy.get('[data-testid="player-name"]').should('contain', 'El Primo')
  cy.get('[data-testid="player-region"]').should('contain', 'Kanto')
  cy.get('[data-testid="player-difficulty"]').should('contain', 'Fácil')
})

it('Debe contener todas las regiones disponibles', () => {
    cy.visit('http://localhost:5173/')

    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    
    cy.contains('h2', 'Región').should('be.visible')
    cy.contains('.option', 'Kanto').should('be.visible')
    cy.contains('.option', 'Johto').should('be.visible')
    cy.contains('.option', 'Hoenn').should('be.visible')
    cy.contains('.option', 'Sinnoh').should('be.visible')
    cy.contains('.option', 'Unova').should('be.visible')
    cy.contains('.option', 'Kalos').should('be.visible')
    cy.contains('.option', 'Alola').should('be.visible')
    cy.contains('.option', 'Galar').should('be.visible')
  })
})

describe('Pantalla de Juego', () => {
  it('Debe permitir ingresar nombre, seleccionar region y dificultad, y comenzar juego', () => {
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
  })

  it('Debe mostrar exactamente 10 cartas en modo fácil', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()

    cy.wait(3500)
    cy.get('.card').should('have.length', 10)
  })

  it('Debe incrementar el contador de fallos cuando las cartas no coinciden', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()

    const cardMap = new Map()
    
    // Mapear las cartas y buscar un par
    cy.get('.card').each(($card, index) => {
      cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
        // Excluir la carta de Ditto (132.png)
        if (!src.includes('132.png')) {
          if (cardMap.has(src)) {
            // Si ya existe la imagen en el mapa, agregar al arreglo
            cardMap.get(src).push(index)
          } else {
            // Si es la primera vez que se encuentra, crear un nuevo arreglo
            cardMap.set(src, [index])
          }
        }
      })
    }).then(() => {
      cy.wait(3500)
      
      cy.contains('Fallos: 0').should('be.visible')
      
      const entries = Array.from(cardMap.entries())
      let differentPair = []
      
      // Buscar dos cartas diferentes
      for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
          if (entries[i][0] !== entries[j][0]) {
            differentPair = [entries[i][1][0], entries[j][1][0]]
            break
          }
        }
        if (differentPair.length > 0) break
      }
      
      // Hacer clic en cartas diferentes
      cy.get('.card').eq(differentPair[0]).click()
      cy.wait(600)
      cy.get('.card').eq(differentPair[1]).click()
      cy.wait(1500)
      
      // Verificar que los fallos se incrementaron
      cy.contains('Fallos: 1').should('be.visible')
    })
  })

it('Debe hacer clic en dos cartas distintas se voltean y luego se ocultan si no coinciden', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  
  // Mapear las cartas y buscar un par
  const cardMap = new Map()
  cy.get('.card').each(($card, index) => {
    // Obtener la imagen de cada carta
    cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
      // Excluir la carta de Ditto (132.png)
      if (!src.includes('132.png')) {
        // Si ya existe la imagen en el mapa, agregar al arreglo
        if (cardMap.has(src)) {
          cardMap.get(src).push(index)
        } else {
          // Si es la primera vez que se encuentra, crear un nuevo arreglo
          cardMap.set(src, [index])
        }
      }
    })
  }).then(() => {
    cy.wait(3500)
    const entries = Array.from(cardMap.entries())
    
    // Buscar dos cartas con imágenes diferentes
    // Buscar un par de cartas con imágenes diferentes y agregarlas al arreglo
    let differentPair = []
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        if (entries[i][0] !== entries[j][0]) {
          differentPair = [entries[i][1][0], entries[j][1][0]]
          break
        }
      }
      if (differentPair.length > 0) break
    }
    
    // Cartas diferentes
    cy.get('.card').eq(differentPair[0]).click()
    cy.wait(600)
    cy.get('.card').eq(differentPair[1]).click()
    cy.wait(1500)
    
    // Ambas cartas se deben ocultar
    cy.get('.card').eq(differentPair[0]).find('img').should('have.attr', 'src').and('include', '132.png')
    cy.get('.card').eq(differentPair[1]).find('img').should('have.attr', 'src').and('include', '132.png')
  })
})

it('Debe verificar que si las dos cartas volteadas coinciden, permanecen volteadas y no se ocultan', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  
  // Mapear las cartas y buscar un par
  const cardMap = new Map()
  cy.get('.card').each(($card, index) => {
    cy.wrap($card).find('img').invoke('attr', 'src').then(src => {
      // Excluir la carta de Ditto (132.png)
      if (!src.includes('132.png')) {
        // Si ya existe la imagen en el mapa, agregar al arreglo
        if (cardMap.has(src)) {
          cardMap.get(src).push(index)
        } else {
          // Si es la primera vez que se encuentra, crear un nuevo arreglo
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
    
    cy.get('.card').eq(pos1).find('img').should('have.attr', 'src').and('eq', imageSrc)
    cy.get('.card').eq(pos2).find('img').should('have.attr', 'src').and('eq', imageSrc)
  })
})

it('Debe navegar a la pantalla de puntaje al completar el juego', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()

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
      
      // Verificar que navegó a la pantalla de score
      cy.url().should('include', '/score')
      cy.contains('h1', '¡Ganaste!').should('be.visible')
    })
  })
})


describe('Pantalla de Leaderboard', () => {
it('Debe mostrar correctamente todos los elementos de la pantalla de puntuación', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  
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
    
    cy.contains('h1', '¡Ganaste!').should('be.visible')
    
    cy.contains('.nombre', 'El Primo').should('be.visible')
    
    cy.contains('lo logró en').should('be.visible')
    cy.contains('intentos').should('be.visible')
    
    cy.contains('button', 'Volver al Menú').should('be.visible')
    cy.contains('button', 'Tabla de Posiciones').should('be.visible')
    
    cy.contains('button', 'Tabla de Posiciones').click()
    cy.url().should('include', '/rank')
    
    cy.go('back')
  })
})

  it('Debe mostrar correctamente todos los elementos de la tabla de posiciones', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()
    
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
      // Filtrar pares de cartas
      const pairs = Array.from(cardMap.entries()).filter(([, positions]) => positions.length === 2)
      
      // Resolver los pares de cartas
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

      cy.contains('button', 'Tabla de Posiciones').click()
   
      // Verificar título principal
      cy.contains('h1', 'Tabla de Posiciones').should('be.visible')
      
      // Verificar filtro de dificultad
      cy.get('.filtro-modo').should('be.visible')
      cy.get('.filtro-modo label').should('contain.text', 'Filtrar por dificultad:')
      cy.get('select#modo').should('exist').and('be.visible')
      
      // Verificar opciones del select
      cy.get('select#modo option').should('have.length', 4)
      cy.get('select#modo option').eq(0).should('contain.text', 'Todos')
      cy.get('select#modo option').eq(1).should('contain.text', 'Fácil')
      cy.get('select#modo option').eq(2).should('contain.text', 'Medio')
      cy.get('select#modo option').eq(3).should('contain.text', 'Difícil')
      
      cy.get('.tabla').should('be.visible')
      cy.get('.tabla thead tr th').should('have.length', 5)
      
      // Verificar nombres de la tabla
      cy.get('.tabla thead tr th').eq(0).should('contain.text', '#')
      cy.get('.tabla thead tr th').eq(1).should('contain.text', 'Nombre')
      cy.get('.tabla thead tr th').eq(2).should('contain.text', 'Intentos')
      cy.get('.tabla thead tr th').eq(3).should('contain.text', 'Modo')
      cy.get('.tabla thead tr th').eq(4).should('contain.text', 'Región')
      
      cy.get('.tabla tbody tr').should('have.length.at.least', 1)
      
      // Verificar que el jugador actual aparece en la tabla
      cy.get('.tabla tbody tr').should('contain.text', 'El Primo')
      cy.get('.tabla tbody tr').should('contain.text', 'Fácil')
      cy.get('.tabla tbody tr').should('contain.text', 'Kanto')
      
      cy.get('.boton').should('be.visible').and('contain.text', 'Volver')
    })
  })

  it('Debe navegar correctamente de vuelta a ScoreView', () => {
    cy.visit('http://localhost:5173/')
    cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
    cy.contains('button', 'Registro/Ingreso').click()
    cy.contains('.option', 'Kanto').click()
    cy.contains('.option', 'Fácil').click()
    cy.contains('button', '¡Comenzar!').click()
    
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
      // Filtrar pares de cartas
      const pairs = Array.from(cardMap.entries()).filter(([, positions]) => positions.length === 2)
      
      const resolvePairs = (index = 0) => {
        if (index >= pairs.length) return
        const [, [pos1, pos2]] = pairs[index] // Toma las posiciones del par actual
        cy.get('.card').eq(pos1).click()
        cy.wait(600)
        cy.get('.card').eq(pos2).click()
        cy.wait(1400)
        if (index + 1 < pairs.length) { // Pasa al siguiente par
          resolvePairs(index + 1)
        }
      }
      
      resolvePairs()
    
      cy.contains('h1', '¡Ganaste!').should('be.visible')
      cy.contains('h2', 'El Primo').should('be.visible')
      cy.contains('h2', 'intentos').should('be.visible')
      
      cy.contains('button', 'Tabla de Posiciones').click()
      
      cy.contains('h1', 'Tabla de Posiciones').should('be.visible')
      cy.get('.tabla').should('be.visible')
      
      cy.contains('button', 'Volver').should('be.visible').click()
      
      cy.contains('h1', '¡Ganaste!').should('be.visible')
      cy.contains('h2', 'El Primo').should('be.visible')

      cy.contains('button', 'Volver al Menú').should('be.visible')
      cy.contains('button', 'Tabla de Posiciones').should('be.visible')
      
      cy.contains('button', 'Tabla de Posiciones').click()
      cy.contains('h1', 'Tabla de Posiciones').should('be.visible')
      
      cy.contains('button', 'Volver').click()
      cy.contains('button', 'Tabla de Posiciones').click()
      
      cy.get('.tabla tbody tr').should('contain.text', 'El Primo')
      cy.get('.tabla tbody tr').should('contain.text', 'Fácil')
      cy.get('.tabla tbody tr').should('contain.text', 'Kanto')
    })
  })

it('Debe filtrar correctamente por dificultad "Fácil" y mostrar solo jugadores de ese modo', () => {
  cy.visit('http://localhost:5173/')
  cy.get('input[placeholder="Ingresa tu nombre de entrenador"]').type('El Primo')
  cy.contains('button', 'Registro/Ingreso').click()
  cy.contains('.option', 'Kanto').click()
  cy.contains('.option', 'Fácil').click()
  cy.contains('button', '¡Comenzar!').click()
  
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
    
    cy.contains('button', 'Tabla de Posiciones').click()
    
    cy.get('select#modo').should('be.visible')
    cy.get('select#modo option').should('contain.text', 'Fácil')
    
    cy.get('select#modo').select('Fácil')
    cy.wait(500)
    
    cy.contains('.tabla tbody tr', 'El Primo').should('be.visible')
    cy.contains('.tabla tbody tr', 'Fácil').should('be.visible') 
    cy.contains('.tabla tbody tr', 'Kanto').should('be.visible')
  })
})
})