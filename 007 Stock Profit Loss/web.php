$router->get('api/v1/porfolio', ['uses' => 'AaPortfolioController@index']);
$router->get('api/v1/porfolio/{id:[0-9]+}', ['uses' => 'AaPortfolioController@fetchOrder']);
$router->post('api/v1/porfolio', ['uses' => 'AaPortfolioController@add']);
$router->put('api/v1/porfolio', ['uses' => 'AaPortfolioController@edit']);
$router->delete('api/v1/porfolio', ['uses' => 'AaPortfolioController@delete']);
$router->get('api/v1/pldata', ['uses' => 'AaPortfolioController@plIndex']);