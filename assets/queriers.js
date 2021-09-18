const queries = {
	depts: `
        SELECT * 
        FROM dept 
        ORDER BY name ASC`,

	budget: `
        SELECT 
            name AS dept,
            CONCAT('$', FORMAT(SUM(salary)/1000, 0), ' K') AS 'total budget'
        FROM employee e
        LEFT JOIN role r 
            ON e.role_id = r.id
        LEFT JOIN dept d 
            ON r.dept_id = d.id
        WHERE d.id = ?`,

	insertdept: `
        INSERT INTO dept (name) 
        VALUES (?)`,

	delete: ( table ) => {
		return `
            DELETE FROM ${table} 
            WHERE id = ?`;
	},

	roles: `
        SELECT 
            r.id, 
            title, 
            CONCAT('$', FORMAT(salary/1000, 0), ' K') AS salary, 
            name AS dept 
        FROM role r 
        LEFT JOIN dept d 
            ON r.dept_id = d.id
        ORDER BY dept ASC, salary*1 ASC`,

	insertRole: `
        INSERT INTO role (title, salary, dept_id) 
        VALUES (?, ?, ?)`,

	employeeStart: `
        SELECT 
            e.id, 
            CONCAT(e.first_name, ' ', e.last_name) AS 'full name', 
            title AS 'job title', 
            CONCAT('$', FORMAT(salary/1000, 0), ' K') AS salary, 
            name AS dept,
            CONCAT(m.first_name, ' ', m.last_name) AS manager 
        FROM employee e 
        LEFT JOIN employee m 
            ON e.manager_id = m.id
        LEFT JOIN role r 
            ON e.role_id = r.id
        LEFT JOIN dept d 
            ON r.dept_id = d.id`,

	employeeOrder: `
        ORDER BY dept ASC, salary*1 DESC`,

	employees: function() {
		return `${this.employeeStart} ${this.employeeOrder}`;
	},

	managers: `        
        SELECT 
            e.id, 
            CONCAT(first_name, ' ', last_name, ' TITLE ', title) AS name
        FROM employee e
        JOIN role r 
            ON e.role_id = r.id    
        WHERE manager_id IS NULL
        ORDER BY name ASC`,

	employeesByManager: function() {
		return `${this.employeeStart} WHERE e.manager_id = ? ${this.employeeOrder}`;
	},

	employeesBydept: function() {
		return `${this.employeeStart} WHERE r.dept_id = ? ${this.employeeOrder}`;
	},

	insertEmployee: `
        INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`,

	employeesByRole: `        
        SELECT 
            e.id, 
            CONCAT(first_name, ' ', last_name, ' TITLE ', title) AS name
        FROM employee e
        JOIN role r 
            ON e.role_id = r.id    
        ORDER BY title ASC, name ASC`,

	updateEmployee: ( data ) => {
		return `
            UPDATE employee
            SET ${data}_id = ?
            WHERE id = ?`;
	}
};

module.exports = queries;