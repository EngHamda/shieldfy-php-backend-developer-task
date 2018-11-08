<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

/**
 * Routes
 */
$router->group(['prefix' => 'api'], function () use ($router) {
    $router->get('tasks', ['uses' => 'TaskController@index']);
    $router->post('tasks', ['uses' => 'TaskController@store']);
    $router->get('tasks/{taskId}', ['uses' => 'TaskController@show']);
    $router->put('tasks/{taskId}', ['uses' => 'TaskController@update']);
    $router->delete('tasks/{taskId}', ['uses' => 'TaskController@destroy']);

    $router->get('categories', ['uses' => 'CategoryController@index']);
    $router->post('categories', ['uses' => 'CategoryController@store']);
    $router->get('categories/{categoryId}', ['uses' => 'CategoryController@show']);
    $router->put('categories/{categoryId}', ['uses' => 'CategoryController@update']);
    $router->delete('categories/{categoryId}', ['uses' => 'CategoryController@destroy']);
});
