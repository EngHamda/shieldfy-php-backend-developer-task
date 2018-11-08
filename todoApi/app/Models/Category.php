<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

/**
 * Category Model
 *
 * @author NourhanHamda
 */

class Category extends Eloquent
{
//    protected $connection = 'mongodb';
    protected $collection = 'categories';
    protected $primaryKey = '_id';
    #ask: why use $unguarded??
//    protected static $unguarded = true;

    protected $fillable = ['name'];

    public function tasks()
    {
        #ask why must be category_id not categoryId for get category in task ??
        return $this->hasMany('App\Models\Task', 'category_id','_id');
    }

}
