
const inquirer = require( 'inquirer' );
const mysql = require( 'mysql2' );
const util = require( 'util' );
const questions = require( './assets/questions' );
const queries = require('./assets/queriers' );

// Connect to the employees_db
const db = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: 'Marvel701',
		database: 'budget_db'
	},
);

const tableEmp = ( table ) => {
	console.log( '\n' );
	console.table( table );
	console.log( '\n' );
};

db.query = util.promisify( db.query );


const selectDptTable = async () => {
	try {
		const table = await db.query( queries.depts );

		tableEmp( table );

		return catagoryAsk();

	} catch ( err ) {
		console.log( err );
	}
};

const selectDptBudget = async () => {
	let chooseDeptQ = [];

	try {
		const table = await db.query( queries.depts );

		let deptList = table.map( dept => ( {
			name: dept.name,
			value: dept.id
		} ) );

		chooseDeptQ.push( constrcutQuestion( 'Choose to view budget', 'dept', deptList ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( chooseDeptQ )
		.then( async ( choosendept ) => {

			const dept = choosendept.dept;

			try {
				const budgetTable = await db.query( queries.budget, dept );

				if( budgetTable[0].dept === null ) {
					console.log( '\x1b[32m', 'This dept has no employees.', '\x1b[0m' );
				} else {
					tableEmp( budgetTable );
				}

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};

// Add a dept to database
const addDept = () => {
	inquirer
		.prompt( questions.addDept )
		.then( async ( addDeptAnswer ) => {

			const deptName = addDeptAnswer.name;

			try {
				await db.query( queries.insertdept, deptName );

				console.log( '\x1b[32m', `Added ${deptName}.`, '\x1b[0m' );

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};


// Ask the user for what action they want to take with depts
const askForDept = () => {
	inquirer
		.prompt( questions.dept )
		.then( ( deptReturn ) => {

			switch( deptReturn.action ) {

			case 'View depts':
				return selectDptTable();

			case 'View dept Budget':
				return selectDptBudget();

			case 'Add A dept':
				return addDept();

			
			}
		} );
};


const constrcutQuestion = ( message, name, object ) => {
	return {
		type: 'list',
		message: message,
		name: name,
		choices: object
	};
};


const selectRole = async () => {
	try {
		const table = await db.query( queries.roles );

		tableEmp( table );

		return catagoryAsk();

	} catch ( err ) {
		console.log( err );
	}
};

const addRole = async () => {
	try {
		const deptTable = await db.query( queries.depts );

		let deptList = deptTable.map( dept => ( {
			name: dept.name,
			value: dept.id
		} ) );

		questions.addRole.push( constrcutQuestion( 'Choose a dept for this role', 'dept', deptList ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( questions.addRole )
		.then( async ( addRoleAnswers ) => {

			const { title, salary, dept } = addRoleAnswers;

			try {
				await db.query( queries.insertRole, [title, salary, dept] );

				console.log( '\x1b[32m', `Added ${title}.`, '\x1b[0m' );

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};



const askForRoleAction = () => {
	inquirer
		.prompt( questions.role )
		.then( ( roleAnswer ) => {

			switch( roleAnswer.action ) {

			case 'View All Roles':
				return askForRoleAction();

			case 'Add A Role':
				return addRole();

			case 'Delete A Role':
				return deleteRole();
			}
		} );
};

const addEmployee = async () => {
	try {
		const roleTable = await db.query( queries.roles );

		let roleArray = roleTable.map( role => ( {
			name: role.title,
			value: role.id
		} ) );

		questions.addEmployee.push( constrcutQuestion( 'Choose a role for this employee', 'role', roleArray ) );

	} catch ( err ) {
		console.log( err );
	}

	try {
		const managerTable = await db.query( queries.managers );

		let manager = managerTable.map( manager => ( {
			name: manager.name,
			value: manager.id
		} ) );

		manager.push( {
			name: 'No Manager',
			value: null
		} );

		questions.addEmployee.push( constrcutQuestion( 'Choose a manager for this employee', 'manager', manager ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( questions.addEmployee )
		.then( async ( addEmployeeAnswers ) => {

			const { first_name, last_name, role, manager } = addEmployeeAnswers;

			try {
				await db.query( queries.insertEmployee, [first_name, last_name, role, manager] );

				console.log( '\x1b[32m', `Added ${first_name} ${last_name} to the database.`, '\x1b[0m' );

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};


const selectEmployeeTable = async () => {
	try {
		const table = await db.query( queries.employees() );

		tableEmp( table );

		return catagoryAsk();

	} catch ( err ) {
		console.log( err );
	}
};

const managerSelect = async () => {
	let managerQuestions = [];

	try {
		const managerTable = await db.query( queries.managers );

		let manager = managerTable.map( manager => ( {
			name: manager.name,
			value: manager.id
		} ) );

		managerQuestions.push( constrcutQuestion( 'What manager\'s employees would you like to see?', 'manager', manager ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( managerQuestions )
		.then( async ( mngrChoice ) => {

			const manager = mngrChoice.manager;

			try {
				const table = await db.query( queries.employeesByManager(), manager );

				if( table.length === 0 ) {
					console.log( '\x1b[32m', 'This manager has no employees.', '\x1b[0m' );
				} else {
					tableEmp( table );
				}

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};


const selectEmployeedeptTable = async () => {
	let deptQuestion = [];

	try {
		const deptTable = await db.query( queries.depts );

		let deptList = deptTable.map( dept => ( {
			name: dept.name,
			value: dept.id
		} ) );

		deptQuestion.push( constrcutQuestion( 'What dept\'s employees would you like to see?', 'dept', deptList ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( deptQuestion )
		.then( async ( deptChoice ) => {

			const dept = deptChoice.dept;

			try {
				const table = await db.query( queries.employeesBydept(), dept );

				if( table.length === 0 ) {
					console.log( '\x1b[32m', 'This dept has no employees.', '\x1b[0m' );
				} else {
					tableEmp( table );
				}

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};



const updateEmployeeRole = async () => {
	let updateEmployeeRoleQuestions = [];

	try {
		const employeeTable = await db.query( queries.employeesByRole );

		let employeeA = employeeTable.map( employee => ( {
			name: employee.name,
			value: employee.id
		} ) );

		updateEmployeeRoleQuestions.push( constrcutQuestion( 'Choose an employee to update thier role', 'employee', employeeA ) );

	} catch ( err ) {
		console.log( err );
	}

	try {
		const roleTable = await db.query( queries.roles );

		let roleArray = roleTable.map( role => ( {
			name: role.title,
			value: role.id
		} ) );

		updateEmployeeRoleQuestions.push( constrcutQuestion( 'Choose a new role for this employee', 'role', roleArray ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( updateEmployeeRoleQuestions )
		.then( async ( updateEmployeeAnswers ) => {

			const { role, employee } = updateEmployeeAnswers;

			try {
				await db.query( queries.updateEmployee( 'role' ), [role, employee] );

				console.log( '\x1b[32m', 'Updated employee\'s role in the database.', '\x1b[0m' );

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};


const updateManager = async () => {
	let managerQuestions = [];

	try {
		const employeeTable = await db.query( queries.employeesByRole );

		let employeeA = employeeTable.map( employee => ( {
			name: employee.name,
			value: employee.id
		} ) );

		managerQuestions.push( constrcutQuestion( 'Choose an employee to update thier manager', 'employee', employeeA ) );
		managerQuestions.push( constrcutQuestion( 'Choose a new manager for this employee. (Choosing the same employee sets the manager to no one)', 'manager', employeeA ) );

	} catch ( err ) {
		console.log( err );
	}

	inquirer
		.prompt( managerQuestions )
		.then( async ( updateEmployeeAnswers ) => {

			let { manager, employee } = updateEmployeeAnswers;

			if( manager === employee ) {
				manager = null;
			}

			try {
				await db.query( queries.updateEmployee( 'manager' ), [manager, employee] );

				console.log( '\x1b[32m', 'Updated employee\'s manager.', '\x1b[0m' );

				return catagoryAsk();

			} catch ( err ) {
				console.log( err );
			}
		} );
};



const employeeAction = () => {
	inquirer
		.prompt( questions.employee )
		.then( ( employeeAnswer ) => {

			switch( employeeAnswer.action ) {

			case 'View All Employees':
				return selectEmployeeTable();

			case 'View Employees by Manager':
				return managerSelect();

			case 'View Employees by dept':
				return selectEmployeedeptTable();

			case 'Add An Employee':
				return addEmployee();

			case 'Update An Employee\'s Role':
				return updateEmployeeRole();

			case 'Update An Employee\'s Manager':
				return updateManager();

			case 'Delete An Employee':
				return deleteEmployee();
			}
		} );
};


const catagoryAsk = () => {
	inquirer
		.prompt( questions.category )
		.then( ( categoryAnswer ) => {

			switch( categoryAnswer.category ) {

			case 'depts':t();

			case 'Roles':
				return askForRoleAction();

			case 'Employees':
				return employeeAction();

			case 'Quit':
				console.log( '\x1b[34m', 'Goodbye!', '\x1b[0m' );
				return db.end();
			}
		} );
};

catagoryAsk();