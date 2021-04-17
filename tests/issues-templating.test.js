import IssuesTemplating from '../src/issues-templating';
import chanceMock from 'chance';

jest.mock('chance', () => ({
    Chance: jest.fn()
}));

describe('issues-templating.test', () => {

    test('Добавление записи', () => {
        //Arrange
        expect.hasAssertions();

        const expectedIssue = {
            id: '1111-2222-3333-4444',
            description: 'Тест',
            severity: 'Low',
            assignedTo: 'Пользователь',
            status: 'Open'
        };

        document.getElementById = jest.fn()
                .mockReturnValueOnce({ addEventListener: jest.fn() })
                .mockReturnValueOnce({ value: expectedIssue.description })
                .mockReturnValueOnce({ value: expectedIssue.severity })
                .mockReturnValueOnce({ value: expectedIssue.assignedTo })
                .mockReturnValueOnce({ reset: jest.fn() })
                .mockReturnValueOnce({});

        chanceMock.Chance.mockReturnValueOnce({ guid: jest.fn().mockReturnValueOnce(expectedIssue.id) });
        const event = {
            preventDefault: jest.fn()
        };

        let savedIssue;
        const issuesDataStorage = { 
            issues: [],
            createIssue: jest.fn(issue => {
                savedIssue = issue;
            })
        };
        const issuesTemplating = new IssuesTemplating(issuesDataStorage);

        //Act
        issuesTemplating.saveIssue(event);

        //Assert
        expect(savedIssue).toEqual(expectedIssue);
        expect(issuesDataStorage.createIssue.mock.calls.length).toBe(1);
    });

    test('Установка статуса "закрыто"', () => {

        //Arrange
        expect.hasAssertions();

        document.getElementById = jest.fn()
                .mockReturnValueOnce({ addEventListener: jest.fn() })
                .mockReturnValueOnce({});

        let changedId;
        const issuesDataStorage = { 
            issues: [],
            changeIssueFieldById: jest.fn(id => {
                changedId = id;
            })
        };
        const issuesTemplating = new IssuesTemplating(issuesDataStorage);

        //Act
        issuesTemplating.setStatusClosed('01');

        //Assert
        expect(changedId).toEqual('01');
        expect(issuesDataStorage.changeIssueFieldById.mock.calls.length).toBe(1);
    });

    test('Удаление записи', () => {

        //Arrange
        expect.hasAssertions();
        
        document.getElementById = jest.fn()
                .mockReturnValueOnce({ addEventListener: jest.fn() })
                .mockReturnValueOnce({});

        let datetedId;
        const issuesDataStorage = { 
            issues: [],
            dateteIssueById: jest.fn(id => {
                datetedId = id;
            })
        };
        const issuesTemplating = new IssuesTemplating(issuesDataStorage);

        //Act
        issuesTemplating.deleteIssue('01');

        //Assert
        expect(datetedId).toEqual('01');
        expect(issuesDataStorage.dateteIssueById.mock.calls.length).toBe(1);
    });
})