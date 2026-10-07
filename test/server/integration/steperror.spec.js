describe('a step that throws', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
        });

        it('leaves no dead event window behind', function() {
            this.game.router.handleError.and.callFake(() => undefined);
            const before = this.game.currentEventWindow;
            this.game.openEventWindow([this.game.getEvent('onTestEvent', {}, () => {
                throw new Error('test error');
            })]);
            this.game.continue();

            expect(this.game.currentEventWindow).toBe(before);
        });
    });
});
