<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class ApiTest extends ExampleTest
{
    /**
     * A basic test example.
     *
     * Running Command  ==> ./vendor/bin/phpunit
     *
     * Running Command For Test this function only ==>
     *          ./vendor/bin/phpunit --filter testResponseStatusExample
     *
     * Note: Not Test Update Routes
     *      - $router->put('categories/{categoryId}', ['uses' => 'CategoryController@update']);
     *      - $router->put('tasks/{taskId}', ['uses' => 'TaskController@update']);
     * Todo: set ids dynamic variables
     *
     * @return void
     */
    public function testResponseStatusExample()
    {
        /************************* ----- test categories routes -----*******************************/

        //$router->get('categories', ['uses' => 'CategoryController@index']);
        $response = $this->call('GET', 'api/categories');
        $this->assertEquals(200, $response->status());

        //$router->post('categories', ['uses' => 'CategoryController@store']);
        $response = $this->call('POST', 'api/categories',
            ['name' => 'Test Category']
        );
        $this->assertEquals(201, $response->status());

        //$router->get('categories/{categoryId}', ['uses' => 'CategoryController@show']);
        $response = $this->call('GET', 'api/categories/5be7f414a1730d2cd2536ea2');
        $this->assertEquals(200, $response->status());

        //$router->delete('categories/{categoryId}', ['uses' => 'CategoryController@destroy']);
        $response = $this->call('DELETE', 'api/categories/5be7f2c8a1730d2a5a2e8092');
        $this->assertEquals(200, $response->status());

        /************************* ----- test tasks routes -----*******************************/

        //$router->get('tasks', ['uses' => 'TaskController@index']);
        $response = $this->call('GET', 'api/tasks');
        $this->assertEquals(200, $response->status());

        //$router->post('tasks', ['uses' => 'TaskController@store']);
        $response = $this->call('POST', 'api/tasks',
            [
                'title' => 'Test Task Title',
                'description' => 'Test Task Description',
                'category_id' => '5be7f414a1730d2cd2536ea2',

            ]);
        $this->assertEquals(201, $response->status());

        //$router->get('tasks/{taskId}', ['uses' => 'TaskController@show']);
        $response = $this->call('GET', 'api/tasks/5be7f11aa1730d296375faa3');
        $this->assertEquals(200, $response->status());

        //$router->delete('tasks/{taskId}', ['uses' => 'TaskController@destroy']);
        $response = $this->call('DELETE', 'api/tasks/5be7f11aa1730d296375faa3');
        $this->assertEquals(200, $response->status());


//        //['prefix' => 'api'],
//         //$router->get('categories', ['uses' => 'CategoryController@index']);
//        $this->json('Get', 'api/categories')
//            ->seeJson([
//                'categoriesSelected' => true,
//            ]);

//        $this->json('Get', 'api/categories', ['name' => 'Sally'])
//            ->seeJson([
//                'categoriesSelected' => true,
//            ]);

//        $this->get('/');
//
//        $this->assertEquals(
//            $this->app->version(), $this->response->getContent()
//        );
    }
}
