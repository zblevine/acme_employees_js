/* FUNCTIONS HERE */

//assumes names are unique
const findEmployeeByName = (name, arr) => arr.filter((item) => item.name === name)[0];

//of course, there is an edge case where the person passed in has no manager
const findManagerFor = (employee, arr) => arr.filter((item) => item.id === employee.managerId)[0];

const findCoworkersFor = (employee, arr) => arr.filter((item) => item.managerId === employee.managerId && item.id !== employee.id);

const findManagementChainForEmployee = (employee, arr) => {
    if (!employee.managerId) return [];
    let manager = findManagerFor(employee, arr);
    return findManagementChainForEmployee(manager, arr).concat(manager);
}

//helper method for generateManagementTree
const getReports = (employee, arr) => arr.filter((item) => item.managerId === employee.id);

//helper method for generateManagementTree
const generateSubtree = (employee, arr) => {
    let newEmp = Object.assign({}, employee);
    newEmp.reports = getReports(employee, arr).map((item) => generateSubtree(item, arr));
    return newEmp;
}

//assuming there's only one employee with no manager
const generateManagementTree = (arr) => generateSubtree(arr.filter((item) => !item.managerId)[0], arr);

//helper method for displayManagementTree
const generateAltTree = (tree, startLevel) => {
    return tree.reports.reduce((acc, item) => acc.concat(generateAltTree(item, startLevel + 1)), [{name: tree.name, level: startLevel}]);
}

const displayManagementTree = (tree) => {
    console.log(generateAltTree(tree, 0).map((item) => '-'.repeat(item.level) + item.name).join('\n'));
}

/* code supplied here */
const employees = [
    { id: 1, name: 'moe'},
    { id: 2, name: 'larry', managerId: 1},
    { id: 4, name: 'shep', managerId: 2},
    { id: 3, name: 'curly', managerId: 1},
    { id: 5, name: 'groucho', managerId: 3},
    { id: 6, name: 'harpo', managerId: 5},
    { id: 8, name: 'shep Jr.', managerId: 4},
    { id: 99, name: 'lucy', managerId: 1}
];

const spacer = (text) => {
if(!text){
    return console.log('');
}
const stars = new Array(5).fill('*').join('');
console.log(`${stars} ${text} ${stars}`);
}

spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee
console.log(findEmployeeByName('moe', employees));//{ id: 1, name: 'moe' }
spacer('')

spacer('findManagerFor Shep')
//given an employee and a list of employees, return the employee who is the manager
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees));//{ id: 4, name: 'shep', managerId: 2 }
spacer('')

spacer('findCoworkersFor Larry')

//given an employee and a list of employees, return the employees who report to the same manager
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
[ { id: 3, name: 'curly', managerId: 1 },
{ id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('');

spacer('findManagementChain for moe')
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager 
console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees));//[  ]
spacer('');

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
[ { id: 1, name: 'moe' },
{ id: 2, name: 'larry', managerId: 1 },
{ id: 4, name: 'shep', managerId: 2 }]
*/
spacer('');


spacer('generateManagementTree')
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
console.log(JSON.stringify(generateManagementTree(employees), null, 2));
/*
{
"id": 1,
"name": "moe",
"reports": [
    {
    "id": 2,
    "name": "larry",
    "managerId": 1,
    "reports": [
        {
        "id": 4,
        "name": "shep",
        "managerId": 2,
        "reports": [
            {
            "id": 8,
            "name": "shep Jr.",
            "managerId": 4,
            "reports": []
            }
        ]
        }
    ]
    },
    {
    "id": 3,
    "name": "curly",
    "managerId": 1,
    "reports": [
        {
        "id": 5,
        "name": "groucho",
        "managerId": 3,
        "reports": [
            {
            "id": 6,
            "name": "harpo",
            "managerId": 5,
            "reports": []
            }
        ]
        }
    ]
    },
    {
    "id": 99,
    "name": "lucy",
    "managerId": 1,
    "reports": []
    }
]
}
*/
spacer('');

spacer('displayManagementTree')
//given a tree of employees, generate a display which displays the hierarchy
displayManagementTree(generateManagementTree(employees));
/*
moe
-larry
--shep
---shep Jr.
-curly
--groucho
---harpo
-lucy
*/
