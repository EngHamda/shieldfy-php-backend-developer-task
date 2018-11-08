<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Model;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;

/**
 * Task Model
 *
 * @author NourhanHamda
 */

class Task extends Eloquent
{
    /**/
    protected $connection = 'mongodb';
    protected $collection = 'tasks';
    protected $primaryKey = '_id';
    protected static $unguarded = true;
//    protected $primaryKey = 'title';
    /**/
    protected $fillable = ['title', 'description'];

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
    }

}
