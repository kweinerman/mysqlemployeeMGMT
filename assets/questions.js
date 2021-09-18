const questions = {
	category: [
		{
			type: 'list',
			message: 'Please select a category to view, add to, update from.',
			name: 'category',
			choices: [
				'Departments',
				'Roles',
				'Employees',
				'Quit'
			]
		}
	],

	dept: [
		{
			type: 'list',
			message: 'What would you like to do?',
			name: 'action',
			choices: [
				'View All Departments',
				'View Department Budget',
				'Add A Department',
				'Delete A Department'
			]
		}
	],

	addDept: [
		{
			type: 'input',
			message: 'What is the name of the department?',
			name: 'name',
			validate: ( input ) => {
				if( input !== '' ) {
					return true;
				}
				return 'Please enter a department name.';
			}
		}
	],

	role: [
		{
			type: 'list',
			message: 'What would you like to do?',
			name: 'action',
			choices: [
				'View All Roles',
				'Add Role',
			]
		}
	],

	addRole: [
		{
			type: 'input',
			message: 'What is the title of the role?',
			name: 'title',
			validate: ( input ) => {
				if( input !== '' ) {
					return true;
				}
				return 'Please enter a role title.';
			}
		},
		{
			type: 'input',
			message: 'What is the salary for the new role?',
			name: 'salary',
			validate: ( input ) => {
				if( input !== '' && /^\d+$/.test( input ) ) {
					return true;
				}
				return 'Please enter a salary.';
			}
		}
	],

	employee: [
		{
			type: 'list',
			message: 'What would you like to do?',
			name: 'action',
			choices: [
				'View All Employees',
				'View Employees by Manager',
				'View Employees by Department',
				'Add An Employee',
				'Update An Employee\'s Role',
				'Update An Employee\'s Manager',
				'Delete An Employee'
			]
		}
	],

	addEmployee: [
		{
			type: 'input',
			message: 'What is the first name of the employee?',
			name: 'first_name',
			validate: ( input ) => {
				if( input !== '' && !( /\d/.test( input ) ) ) {
					return true;
				}
				return 'Please enter a first name without numbers.';
			}
		},
		{
			type: 'input',
			message: 'What is the last name of the employee?',
			name: 'last_name',
			validate: ( input ) => {
				if( input !== '' && !( /\d/.test( input ) ) ) {
					return true;
				}
				return 'Please enter a last name without numbers.';
			}
		},
	],
};

module.exports = questions;