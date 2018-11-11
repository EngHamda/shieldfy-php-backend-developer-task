<?php

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Task;

class CategoriesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Running Commands  ==>
     *      composer dump-autoload
     *      php artisan db:seed --class=CategoriesCollectionSeeder
     *
     * @return void
     */
    public function run()
    {
        //
        Task::truncate();
        Category::truncate();

        // And now, let's create a few Categories in our database:
        Category::create(['name' => "Home Category"]);
        Category::create(['name' => "Work Category"]);
    }
}
