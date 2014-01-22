const test_data_1 = { // test data 1 for test case
    'access_token': 'some_token',
    'user_id': 123456789123456789123456789
};

const test_data_2 = { // test data 2 for test case
    'access_token': 'some_other_token',
    'user_id': 44444444444444444444444444
};

exports.flow_vars_1 = {
    "response.content": test_data_1
};

exports.flow_vars_2 = {
    "response.content": test_data_2
};

// the same test case will be executed
// with above test data variants, which
// are: flow_vars_1 & flow_vars_2