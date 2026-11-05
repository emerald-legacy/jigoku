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

describe('Wrathstorm Dancer with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['wrathstorm-dancer'],
                    dynastyDeck: ['moto-raiju'],
                    hand: ['join-the-fray']
                },
                player2: {
                    dynastyDeck: ['incessant-moto'],
                    hand: ['join-the-fray']
                }
            });

            this.dancer = this.player1.findCardByName('wrathstorm-dancer');
            this.raiju = this.player1.placeCardInProvince('moto-raiju', 'province 1');
            this.raiju.facedown = false;
            this.fray1 = this.player1.findCardByName('join-the-fray');
            this.incessant = this.player2.placeCardInProvince('incessant-moto', 'province 1');
            this.incessant.facedown = false;
            this.fray2 = this.player2.findCardByName('join-the-fray');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.dancer],
                defenders: []
            });
        });

        it('bows if your other Berserker is on the enemy side', function () {
            this.player2.pass();
            this.player1.clickCard(this.fray1);
            this.player1.clickCard(this.raiju);
            this.player1.clickPrompt('player2');
            expect(this.game.currentConflict.defenders).toContain(this.raiju);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 3 vs 1');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(true);
        });

        it('does not bow if an opponent\'s Berserker is on its side', function () {
            this.player2.clickCard(this.fray2);
            this.player2.clickCard(this.incessant);
            this.player2.clickPrompt('player1');
            expect(this.game.currentConflict.attackers).toContain(this.incessant);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 won a military conflict 5 vs 0');
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(false);
        });
    });
});
