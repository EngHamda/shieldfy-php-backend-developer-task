<?php

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Category::truncate();

        // And now, let's create a few Categories in our database:
        for ($i = 0; $i < 10; $i++) {
            Category::create([
                'name' => "Category ".$i,
            ]);
        }
    }
}
