# KanbanBoardApi.DefaultApi

All URIs are relative to *http://localhost:5162*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addPost**](DefaultApi.md#addPost) | **POST** /add | Add a new task
[**deletePost**](DefaultApi.md#deletePost) | **POST** /delete | Delete a task
[**movePost**](DefaultApi.md#movePost) | **POST** /move | Move a task to a different status
[**rootGet**](DefaultApi.md#rootGet) | **GET** / | Get all tasks



## addPost

> AddPost201Response addPost(title, description)

Add a new task

Creates a new task with the given title and description

### Example

```javascript
import KanbanBoardApi from 'kanban_board_api';

let apiInstance = new KanbanBoardApi.DefaultApi();
let title = "title_example"; // String | Task title
let description = "description_example"; // String | Task description
apiInstance.addPost(title, description, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **title** | **String**| Task title | 
 **description** | **String**| Task description | 

### Return type

[**AddPost201Response**](AddPost201Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded
- **Accept**: application/json


## deletePost

> DeletePost200Response deletePost(taskId)

Delete a task

Removes a task from the database

### Example

```javascript
import KanbanBoardApi from 'kanban_board_api';

let apiInstance = new KanbanBoardApi.DefaultApi();
let taskId = 56; // Number | Task ID to delete
apiInstance.deletePost(taskId, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **Number**| Task ID to delete | 

### Return type

[**DeletePost200Response**](DeletePost200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded
- **Accept**: application/json


## movePost

> AddPost201Response movePost(taskId, status)

Move a task to a different status

Updates the status of an existing task

### Example

```javascript
import KanbanBoardApi from 'kanban_board_api';

let apiInstance = new KanbanBoardApi.DefaultApi();
let taskId = 56; // Number | Task ID to move
let status = "status_example"; // String | New status (todo, in_progress, done)
apiInstance.movePost(taskId, status, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **taskId** | **Number**| Task ID to move | 
 **status** | **String**| New status (todo, in_progress, done) | 

### Return type

[**AddPost201Response**](AddPost201Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/x-www-form-urlencoded
- **Accept**: application/json


## rootGet

> Get200Response rootGet()

Get all tasks

Returns a list of all tasks

### Example

```javascript
import KanbanBoardApi from 'kanban_board_api';

let apiInstance = new KanbanBoardApi.DefaultApi();
apiInstance.rootGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Get200Response**](Get200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

