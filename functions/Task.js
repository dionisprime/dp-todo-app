function Task(taskName, status, priority) {
    this.name = taskName;
    this.status = status;
    this.priority = priority;
    this.changeStatus = function (statusToChange) {
        this.status = statusToChange;
    };
    this.changePriority = function (priorityToChange) {
        this.priority = priorityToChange;
    };
}

module.exports = Task;
