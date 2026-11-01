describe('Wrathstorm Dancer', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['wrathstorm-dancer', 'hida-yakamo', 'bayushi-manipulator']
                },
                player2: {
                }
            });

            this.dancer = this.player1.findCardByName('wrathstorm-dancer');
            this.yakamo = this.player1.findCardByName('hida-yakamo');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
        });


        it('does not bow as a result of conflict resolution if player has another berserker participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dancer, this.yakamo],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(false);
        });

        it('bows as a result of conflict resolution if player has no other berserker participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dancer],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(true);
        });

        it('bows as a result of conflict resolution if the other berserker is at home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dancer, this.manipulator],
                defenders: []
            });
            expect(this.yakamo.isParticipating()).toBe(false);
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(true);
            expect(this.manipulator.bowed).toBe(true);
        });
    });
});

describe('Wrathstorm Dancer and an opposing berserker', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['wrathstorm-dancer']
                },
                player2: {
                    inPlay: ['hida-yakamo']
                }
            });

            this.dancer = this.player1.findCardByName('wrathstorm-dancer');
            this.yakamo = this.player2.findCardByName('hida-yakamo');
        });

        it('bows as a result of conflict resolution if the only other berserker is on the other side', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dancer],
                defenders: [this.yakamo]
            });
            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 4 vs 3');
            expect(this.dancer.bowed).toBe(true);
        });
    });
});
