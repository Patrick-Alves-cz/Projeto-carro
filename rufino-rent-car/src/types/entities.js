/**
 * entities.js — central JSDoc typedefs for the domain model.
 *
 * The project intentionally uses plain JS + JSDoc instead of full
 * TypeScript for now (per the requested stack), but every entity shape
 * is documented here so editors still provide autocomplete/type-checking
 * hints, and so a future TS migration has a ready-made source of truth.
 */

/**
 * @typedef {'suv'|'sedan'|'hatch'|'pickup'|'popular'|'utilitario'} VehicleCategory
 * @typedef {'disponivel'|'alugado'|'manutencao'|'reservado'} VehicleStatus
 *
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} photo - base64 data URL or empty string
 * @property {string} brand
 * @property {string} model
 * @property {string} version
 * @property {number} year
 * @property {string} color
 * @property {string} plate
 * @property {string} renavam
 * @property {string} chassis
 * @property {number} purchaseValue
 * @property {string} purchaseDate - ISO date
 * @property {number} mileage
 * @property {VehicleCategory} category
 * @property {VehicleStatus} status
 * @property {string} notes
 * @property {string} insuranceExpiry - ISO date
 * @property {string} licensingExpiry - ISO date (IPVA/licenciamento)
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} name
 * @property {string} cpf
 * @property {string} rg
 * @property {string} cnh
 * @property {string} cnhExpiry - ISO date
 * @property {string} phone
 * @property {string} whatsapp
 * @property {string} email
 * @property {string} address
 * @property {string} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {'pendente'|'ativa'|'finalizada'|'cancelada'} RentalStatus
 * @typedef {'dinheiro'|'pix'|'cartao_credito'|'cartao_debito'|'transferencia'} PaymentMethod
 *
 * @typedef {Object} Rental
 * @property {string} id
 * @property {string} clientId
 * @property {string} vehicleId
 * @property {string} pickupDate - ISO date
 * @property {string} returnDate - ISO date (planned)
 * @property {string} actualReturnDate - ISO date (actual, set on finalize)
 * @property {number} dailyRate
 * @property {number} days
 * @property {number} totalValue
 * @property {PaymentMethod} paymentMethod
 * @property {RentalStatus} status
 * @property {string} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {'seguro'|'combustivel'|'ipva'|'manutencao'|'pecas'|'pneus'|'lavagem'|'multas'|'outros'} ExpenseCategory
 *
 * @typedef {Object} Expense
 * @property {string} id
 * @property {string} description
 * @property {ExpenseCategory} category
 * @property {number} value
 * @property {string} date - ISO date
 * @property {string|null} vehicleId
 * @property {string} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export {}
