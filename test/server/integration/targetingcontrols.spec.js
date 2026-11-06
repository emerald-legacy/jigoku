describe('Targeting controls', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['hiruma-pathfinder']
                }
            });
            this.pathfinder = this.player1.moveCard('hiruma-pathfinder', 'province 1');
        });

        it('show the triggering card in a select prompt of an ability without targets', function() {
            this.player1.clickCard(this.pathfinder);
            this.player1.clickPrompt('0');
            this.player1.clickCard(this.pathfinder);

            expect(this.player1).toHavePrompt('Choose a province to look at');
            const control = this.player1.currentPrompt().controls[0];
            expect(control.source.uuid).toBe(this.pathfinder.uuid);
            expect(control.targets.map((target) => target.uuid)).toEqual([this.pathfinder.uuid]);
        });
    });
});
