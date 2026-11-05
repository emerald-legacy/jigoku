describe('Obstinate Witch Hunter', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['obstinate-witch-hunter', 'obstinate-witch-hunter']
                },
                player2: {
                    inPlay: ['isawa-tadaka']
                }
            });

            this.hunter1 = this.player1.filterCardsByName('obstinate-witch-hunter')[0];
            this.hunter2 = this.player1.filterCardsByName('obstinate-witch-hunter')[1];

            this.tadaka = this.player2.findCardByName('isawa-tadaka');

            this.hunter1.fate = 1;
        });

        it('with another tainted character should not lose fate or be discarded', function () {
            this.tadaka.taint();
            this.advancePhases('fate');

            this.player2.clickPrompt('Done');
            expect(this.hunter1.fate).toBe(1);
            expect(this.hunter2.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player1 uses Obstinate Witch Hunter to stop Obstinate Witch Hunter being discarded or losing fate this phase');
        });

        it('should ignore if self tained', function () {
            this.hunter1.taint();
            this.advancePhases('fate');

            this.player2.clickPrompt('Done');
            expect(this.hunter1.fate).toBe(0);
            expect(this.hunter2.location).toBe('play area');
        });
    });
});

describe('Obstinate Witch Hunter and sacrifices', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['obstinate-witch-hunter', 'kaiu-envoy']
                },
                player2: {
                    fate: 3,
                    inPlay: ['isawa-tadaka', 'hida-o-ushi'],
                    hand: ['way-of-the-crab']
                }
            });

            this.hunter = this.player1.findCardByName('obstinate-witch-hunter');
            this.envoy = this.player1.findCardByName('kaiu-envoy');
            this.tadaka = this.player2.findCardByName('isawa-tadaka');
            this.oushi = this.player2.findCardByName('hida-o-ushi');
            this.hunter.fate = 1;
            this.envoy.fate = 1;
            this.oushi.fate = 1;
            this.player1.togglePromptedActionWindow('fate', true);
            this.player2.togglePromptedActionWindow('fate', true);
        });

        it('cannot be sacrificed this phase', function () {
            this.tadaka.taint();
            this.advancePhases('fate');
            this.player2.clickPrompt('Done');
            this.player1.pass();
            this.player2.clickCard('way-of-the-crab');
            this.player2.clickCard(this.oushi);
            expect(this.oushi.location).toBe('dynasty discard pile');
            expect(this.player1).toHavePrompt('Way of the Crab');
            expect(this.player1).toBeAbleToSelect(this.envoy);
            expect(this.player1).not.toBeAbleToSelect(this.hunter);
            this.player1.clickCard(this.envoy);
            expect(this.envoy.location).toBe('dynasty discard pile');
            expect(this.hunter.location).toBe('play area');
        });
    });
});
