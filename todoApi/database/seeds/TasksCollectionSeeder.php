<?php

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Task;

class TasksCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Running Commands  ==>
     *      composer dump-autoload
     *      php artisan db:seed --class=TasksCollectionSeeder
     *
     * @return void
     */
    public function run()
    {
        //
        Task::truncate();

        // get all categories
        $categoriesCollection = Category::get();
        foreach($categoriesCollection as $result){
            for($i=0; $i<5; $i++ ){
                // And now, let's create a few Tasks in our database:
                Task::create(
                    [
                        'title' => "Task ".($i+1)." in $result->name",
                        'description' => "Task description".($i+1),
                        'category_id' => $result->_id
                    ]
                );
            }//endFor
        }//endForeach
    }
}
