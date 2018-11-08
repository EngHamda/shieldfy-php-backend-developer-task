<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Illuminate\Http\Request;
use App\Models\Category;
use Psy\Util\Json;

/**
 * Category Controller
 *
 * - Todo: refactor response
 * - Todo: create log service,log method
 *
 * @author NourhanHamda
 */

class CategoryController extends Controller
{
    protected $model;
    protected $log;
    protected $logPath;
    protected $logFile;

    public function __construct(Category $category)
    {
        $this->model = $category;
        $this->logPath = storage_path('logs');
        //create log directory if not exist
        if (!file_exists($this->logPath)) {
            mkdir($this->logPath, 0775, true);
        }
        $this->logFile = $this->logPath.DIRECTORY_SEPARATOR.config('app.log_file');
        $this->log = new Logger('category');
        $this->log->pushHandler(new StreamHandler($this->logFile, Logger::DEBUG));
    }

    /**
     * Display a listing of the resource.
     *
     * @return Json  Response
     */
    public function index()
    {
        try {
            $collection = $this->model->with('tasks')->get();
            return response()->json(
                ["status"  => "Success", "message" => "Categories List", "data" =>$collection],
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
     * - save into database
     *      - Note:
     *              $this->model->save();return true OR false
     *              $this->model->create($data);return created Object
     *              $this->model->fill($data);return none
     *
     * @param  Request  $request
     * @return Json  Response
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), ['name' => 'required']);
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
            $data = ['name' => $request->input('name')];
            $response = $this->model->create($data);

            return response()->json(
                [
                    "status" => "Success",
                    "message" => "The category was created successfully",
                    "data" => $response
                ],
                201
            );
        } catch (\Exception $e) {
            $this->log->error('Category.Store',
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
     *
     * @param  Int  $id
     * @return Json  Response
     */
    public function show($id)
    {
        try {
            $modelObj = $this->model->find($id);
            if (empty($modelObj)) {
                return response()->json(
                    ["status" => "Fail", "message" => "No Category with ID: $id"],
                    400
                );
            } else {
                return response()->json(
                    ["status" => "Success", "message" => "Category Exists", "data" => $modelObj],
                    200
                );
            }
        } catch (\Exception $e) {
            $this->log->error('Category.Show',
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
     *
     * @param  Request  $request
     * @param  Int  $id
     * @return Json  Response
     */
    public function update(Request $request, $id)
    {
        try {
            $modelObj = $this->model->find($id);
            if (empty($modelObj)) {
                return response()->json(
                    ["status" => "Fail", "message" => "No Category with ID: $id"],
                    400
                );
            }
            $validator = Validator::make($request->all(), ['name' => 'required']);
            if ($validator->fails()) {
                return response()->json(
                    [
                        "status" => "Fail",
                        "message" => "Validation errors in your request",
                        "errors" => $validator->errors()
                    ],
                    400
                );
            }
            $data = ['name' => $request->input('name')];
            $this->model->fill($data);
            return response()->json(
                ["status" => "Success", "message" => "The category was updated successfully"],
                200
            );
        } catch (\Exception $e) {
            $this->log->error('Category.Update',
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
     * - Todo: associate for task, 400
     *
     * @param  Int  $id
     * @return Json  Response
     */
    public function destroy($id)
    {
        try {
            $modelObj = $this->model->find($id);
            if (empty($modelObj)) {
                return response()->json(
                    ["status" => "Fail", "message" => "No Category with ID: $id"],
                    400
                );
            }
            $deleted = $this->model->destroy($id);
            if ($deleted) {
                return response()->json(
                    [
                        "status" => "Success",
                        "message" => "The category was deleted successfully"
                    ],
                    200
                );
            }
        } catch (\Exception $e) {
            $this->log->error('Category.Destroy',
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