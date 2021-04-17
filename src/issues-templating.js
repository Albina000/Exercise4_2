/* eslint-disable import/no-extraneous-dependencies */
import chance from 'chance';

/** Visualization of working with issues. */
const IssuesTemplating = class {
  /**
   * Creates class for visualization of working with issues.
   * @param {Object} issuesDataStorage - Storage for an issues.
   */
  constructor(issuesDataStorage) {
    this.issuesDataStorage = issuesDataStorage;
    document.getElementById('issueInputForm').addEventListener('submit', this.saveIssue.bind(this));
  }

  saveIssue(e) {
    const issueDesc = document.getElementById('issueDescInput').value;
    const issueSeverity = document.getElementById('issueSeverityInput').value;
    const issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    const issueId = chance.Chance().guid();
    const issueStatus = 'Open';

    const issue = {
      id: issueId,
      description: issueDesc,
      severity: issueSeverity,
      assignedTo: issueAssignedTo,
      status: issueStatus,
    };

    this.issuesDataStorage.createIssue(issue);

    document.getElementById('issueInputForm').reset();

    this.displayIssues();

    e.preventDefault();
  }

  setStatusClosed(id) {
    this.issuesDataStorage.changeIssueFieldById(id, 'status', 'Closed');
    this.displayIssues();
  }

  deleteIssue(id) {
    this.issuesDataStorage.dateteIssueById(id);
    this.displayIssues();
  }

  displayIssues() {
    const { issues } = this.issuesDataStorage;
    const issuesList = document.getElementById('issuesList');

    issuesList.innerHTML = '';

    const createHeader = (tagName, innerText) => {
      const headerElement = document.createElement(tagName);
      headerElement.innerText = innerText;
      return headerElement;
    };

    const createSpan = (classNames, innerText) => {
      const spanElement = document.createElement('span');
      spanElement.className = classNames;
      if (innerText !== '') {
        spanElement.innerText = innerText;
      }
      return spanElement;
    };

    const createParagraph = (classNames, innerText, insertTextIntoSpan) => {
      const paragraphElement = document.createElement('p');
      const spanElement = insertTextIntoSpan
        ? createSpan(classNames, innerText)
        : createSpan(classNames, '');
      paragraphElement.appendChild(spanElement);
      if (!insertTextIntoSpan) {
        const textNode = document.createTextNode(innerText);
        paragraphElement.appendChild(textNode);
      }
      return paragraphElement;
    };

    const createLink = (classNames, innerText, handler) => {
      const linkElement = document.createElement('a');
      linkElement.className = classNames;
      linkElement.innerText = innerText;
      linkElement.onclick = handler;
      return linkElement;
    };

    issues.forEach(issue => {
      const { id, description: desc, severity, assignedTo, status } = issue;
      const div = document.createElement('div');
      div.className = 'well';
      const h6 = createHeader('h6', `Issue ID: ${id}`);
      const p1 = createParagraph('label label-info', `${status}`, true);
      const h3 = createHeader('h3', `${desc}`);
      const p2 = createParagraph('glyphicon glyphicon-time', ` ${severity}`, false);
      const p3 = createParagraph('glyphicon glyphicon-user', ` ${assignedTo}`, false);
      const a1 = createLink('btn btn-warning', 'Close', this.setStatusClosed.bind(this, `${id}`));
      const a2 = createLink('btn btn-danger', 'Delete', this.deleteIssue.bind(this, `${id}`));
      const space = document.createTextNode(' ');

      div.appendChild(h6);
      div.appendChild(p1);
      div.appendChild(h3);
      div.appendChild(p2);
      div.appendChild(p3);
      div.appendChild(a1);
      div.appendChild(space);
      div.appendChild(a2);

      issuesList.appendChild(div);
    });
  }
};

export default IssuesTemplating;
