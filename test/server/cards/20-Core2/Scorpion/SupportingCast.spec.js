describe('Supporting Cast', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['assassination', 'tarnished-reputation'],
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    hand: ['supporting-cast'],
                    inPlay: ['shosuro-sadako', 'bayushi-manipulator']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.assassination = this.player1.findCardByName('assassination');
            this.tarReputation = this.player1.findCardByName('tarnished-reputation');

            this.supportingCast = this.player2.findCardByName('supporting-cast');
            this.shosuroSadako = this.player2.findCardByName('shosuro-sadako');
            this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');

            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker],
                defenders: [this.bayushiManipulator, this.shosuroSadako]
            });
        });

        it('gives a military bonus to another character', function () {
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.shosuroSadako);

            expect(this.shosuroSadako.location).toBe('conflict discard pile');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.supportingCast);

            expect(this.player2).toHavePrompt('Choose a character to give +3 military skill');
            this.player2.clickCard(this.bayushiManipulator);
            expect(this.getChatLogs(5)).toContain(
                'player2 plays Supporting Cast to give +3 military skill to Bayushi Manipulator - Shosuro Sadako was just a distraction'
            );
        });

        it('gives a military bonus to another character, bowing the first', function () {
            this.player2.pass();
            this.player1.clickCard(this.tarReputation);
            this.player1.clickCard(this.shosuroSadako);

            expect(this.shosuroSadako.bowed).toBe(false);
            expect(this.shosuroSadako.isDishonored).toBe(true);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.supportingCast);

            expect(this.player2).toHavePrompt('Choose a character to give +3 military skill');
            this.player2.clickCard(this.bayushiManipulator);

            expect(this.shosuroSadako.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player2 plays Supporting Cast to give +3 military skill to Bayushi Manipulator - Shosuro Sadako was just a distraction'
            );
        });

        it('can give the bonus to an opponent\'s participating character', function () {
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.shosuroSadako);
            this.player2.clickCard(this.supportingCast);
            expect(this.player2).toBeAbleToSelect(this.bayushiManipulator);
            expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
        });
    });
});

describe('Supporting Cast with targets of both players', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    hand: ['supporting-cast'],
                    inPlay: ['shosuro-sadako', 'bayushi-manipulator']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.shosuroSadako = this.player2.findCardByName('shosuro-sadako');
            this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                province: this.shamefulDisplay,
                attackers: [this.matsuBerserker],
                defenders: [this.bayushiManipulator, this.shosuroSadako]
            });
        });

        it('only bows your own targeted character', function () {
            this.player2.clickCard(this.shamefulDisplay);
            this.player2.clickCard(this.shosuroSadako);
            this.player2.clickCard(this.matsuBerserker);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('Honor');
            this.player2.clickCard(this.shosuroSadako);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard('supporting-cast');
            this.player2.clickCard(this.bayushiManipulator);
            expect(this.shosuroSadako.bowed).toBe(true);
            expect(this.matsuBerserker.bowed).toBe(false);
        });
    });
});

describe('Supporting Cast and a targeted attachment', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['let-go'],
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    hand: ['supporting-cast'],
                    inPlay: [{ card: 'shosuro-sadako', attachments: ['fine-katana'] }, 'bayushi-manipulator']
                }
            });
            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.letGo = this.player1.findCardByName('let-go');
            this.supportingCast = this.player2.findCardByName('supporting-cast');
            this.shosuroSadako = this.player2.findCardByName('shosuro-sadako');
            this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
            this.katana = this.player2.findCardByName('fine-katana');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker],
                defenders: [this.bayushiManipulator, this.shosuroSadako]
            });
        });

        it('does not trigger when only an attachment you control was targeted', function () {
            this.player2.pass();
            this.player1.clickCard(this.letGo);
            this.player1.clickCard(this.katana);
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.player2).not.toBeAbleToSelect(this.supportingCast);
        });
    });
});
