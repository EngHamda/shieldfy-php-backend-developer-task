<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Task;
use Psy\Util\Json;

/**
 * Task Controller
 *
 * - Todo: refactor response
 * - Todo: create log service,log method
 *
 * @author NourhanHamda
 */

class TaskController extends Controller
{
    protected $model;
    protected $log;
    protected $logPath;
    protected $logFile;

    public function __construct(Task $task, Category $category)
    {
        $this->task = $task;
        $this->category = $category;
        $this->logPath = storage_path('logs');
        //create log directory if not exist
        if (!file_exists($this->logPath)) {
            mkdir($this->logPath, 0775, true);
        }
        $this->logFile = $this->logPath.DIRECTORY_SEPARATOR.config('app.log_file');
        $this->log = new Logger('task');
        $this->log->pushHandler(new StreamHandler($this->logFile, Logger::DEBUG));
    }

    /**
     * Display a listing of the resource.
     *
     * Note:
     * - $this->task->with('category')->get() ==>for get with category object
     * - $this->task->all() ==>for get without category object
     *
     * @return Json  Response
     */
    public function index()
    {
        try {
            $collection = $this->task->with('category')->get();
            return response()->json(
                ["status"  => "Success", "message" => "Task List", "data" =>$collection],
                200
            );
        } catch (\Exception $e) {
            $this->log->error('Category.Index',
                [
                    "Code"          => $e->getCode(),
                    "Message"       => $e->getMessage(),
                    "Line"          => $e->getLine(),
                    "File"          => $e->getFile(),
                    "TraceAsString" => $e->getTraceAsString()
                ]
            );
            return response()->json(
                ["status"  => "Fail", "message" => "Something is broken"],
                500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     * - validation
     *      - Note:
     *              code: 400 bad request
     *              code: 422 un-processable entity
     *              code: 204 success without response
     *              code: 503 service unavailable
     *              code: 500 something is broken
     * - get request data
     *      - Note: $request->input('name') === $request->name
     * - find category from database
     * - save into database
     *      - Note:
     *              $this->model->save();return true OR false
     *              $this->model->create($data);return created Object
     *              $this->model->fill($data);return none
     *
     *  => Note: has question inside
     *
     * @param  Request  $request
     * @return Json  Response
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(),
                ['title' => 'required', 'description' => 'required', 'categoryId' => 'required']
            );
            if ($validator->fails()) {
                return response()->json(
                    [
                        "status" => "Fail",
                        "message" => "Validation errors in your request",
                        "errors" => $validator->errors()
                    ],
                    422
                );
            }
            #ASK:in $data why when replace category_id with categoryId (added categoryId,category_id)
            #,and in relation for get category model must add category_id not categoryId ???
            $data = [
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'category_id' => $request->input('categoryId')
            ];
            $categoryObj = $this->category->find($data['category_id']);
            if(empty($categoryObj)){
                return response()->json(
                    [
                        "status" => "Fail",
                        "message" => "Category doesn't exist"
                    ],
                    422
                );

            }
            $taskObj = $this->task->create($data);
            $categoryUpdated = $categoryObj->tasks()->save($taskObj);

            if($categoryUpdated){
                #ASK: How do using laravel???
                $taskObj->category = $categoryObj;
                return response()->json(
                    [
                        "status" => "Success",
                        "message" => "The task was created successfully",
                        "data" => $taskObj
                    ],
                    201
                );
            } else{
                return response()->json(
                    [
                        "status" => "Failed",
                        "message" => "The task was created successfully, but failed update category",
                        "data" => $taskObj
                    ],
                    422
                );
            }
        } catch (\Exception $e) {
            $this->log->error('Task.Store',
                [
                    "Code"          => $e->getCode(),
                    "Message"       => $e->getMessage(),
                    "Line"          => $e->getLine(),
                    "File"          => $e->getFile(),
                    "TraceAsString" => $e->getTraceAsString()
                ]
            );
            return response()->json(
                ["status"  => "Fail", "message" => "Something is broken"],
                500
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Json  Response
     */
    public function show($id)
    {
        try {
            $taskObj = $this->task->with('category')->find($id);
            if (empty($taskObj)) {
                return response()->json(
                    ["status" => "Fail", "message" => "No Task with ID: $id"],
                    400
                );
            } else {
                return response()->json(
                    ["status" => "Success", "message" => "Task Exists", "data" => $taskObj],
                    200
                );
            }
        } catch (\Exception $e) {
            $this->log->error('Task.Show',
                [
                    "Code"          => $e->getCode(),
                    "Message"       => $e->getMessage(),
                    "Line"          => $e->getLine(),
                    "File"          => $e->getFile(),
                    "TraceAsString" => $e->getTraceAsString()
                ]
            );
            return response()->json(
                ["status"  => "Fail", "message" => "Something is broken"],
                500
            );
        }
    }

    /**
     * Update the specified resource in storage.
     * - get required object from database
     * - validation
     * - get request data
     * - save required object with new data into database
     * - Todo: associate for task ,400 204 if without response
     *
     * @param  Request  $request
     * @param  Int  $id
     * @return Json  Response
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(),
                ['title' => 'required', 'description' => 'required', 'categoryId' => 'required']
            );
            if ($validator->fails()) {
                return response()->json(
                    [
                        "status" => "Fail",
                        "message" => "Validation errors in your request",
                        "errors" => $validator->errors()
                    ],
                    422
                );
            }
            $data = [
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'category_id' => $request->input('categoryId')
            ];
            $taskObj = $this->task->find($id);
            if (empty($taskObj)) {
                return response()->json(
                    ["status" => "Fail", "message" => "No Task with ID: $id"],
                    400
                );
            }
            $this->task->fill($data);
            if($taskObj->category_id != $data['category_id']){
                //get new category
                $categoryNewObj = $this->category->find($data['category_id']);
                if(empty($categoryNewObj)){
                    return response()->json(
                        [
                            "status" => "Fail",
                            "message" => "Category doesn't exist"
                        ],
                        422
                    );

                }
                //save task into new category
                $this->task->category()->associate($categoryNewObj);
                if($this->task->save()){
                    //remove task from old category
                    #ask: if change cate not removed from old cate
                    $deleted = $this->task->destroy($taskObj->_id);
                    if ($deleted) {
                        return response()->json(
                            ["status" => "Success", "message" => "The task was updated successfully"],
                            201
                        );
                    }//endIF old task deleted
                } else{
                    return response()->json(
                        [
                            "status" => "Failed",
                            "message" => "The task was updated successfully, but failed update category",
                        ],
                        422
                    );
                }//endIF task updated
            }

        } catch (\Exception $e) {
            $this->log->error('Task.Update',
                [
                    "Code"          => $e->getCode(),
                    "Message"       => $e->getMessage(),
                    "Line"          => $e->getLine(),
                    "File"          => $e->getFile(),
                    "TraceAsString" => $e->getTraceAsString()
                ]
            );
            return response()->json(
                ["status"  => "Fail", "message" => "Something is broken"],
                500
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     * - get required object from database
     * - delete object from database
     *
     * @param  Int  $id
     * @return Json  Response
     */
    public function destroy($id)
    {
        try {
            $taskObj = $this->task->find($id);
            if (empty($taskObj)) {
                return response()->json(
                    ["status" => "Fail", "message" => "No Task with ID: $id"],
                    400
                );
            }
            $deleted = $this->task->destroy($id);
            if ($deleted) {
                return response()->json(
                    [
                        "status" => "Success",
                        "message" => "The task was deleted successfully"
                    ],
                    200
                );
            }
        } catch (\Exception $e) {
            $this->log->error('Task.Destroy',
                [
                    "Code"          => $e->getCode(),
                    "Message"       => $e->getMessage(),
                    "Line"          => $e->getLine(),
                    "File"          => $e->getFile(),
                    "TraceAsString" => $e->getTraceAsString()
                ]
            );
            return response()->json(
                ["status"  => "Fail", "message" => "Something is broken"],
                500
            );
        }
    }
}