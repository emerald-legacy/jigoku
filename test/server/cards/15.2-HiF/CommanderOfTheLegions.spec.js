describe('Commander of the Legions', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'commander-of-the-legions', 'matsu-berserker'],
                    honor: 15
                },
                player2: {
                    inPlay: ['moto-youth', 'cunning-negotiator', 'akodo-toturi'],
                    honor: 10
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.commanderOfTheLegions = this.player1.findCardByName('commander-of-the-legions');
            this.berserker = this.player1.findCardByName('matsu-berserker');

            this.enemyYouth = this.player2.findCardByName('moto-youth');
            this.enemyNegotiator = this.player2.findCardByName('cunning-negotiator');
            this.enemeyAkodoToturi = this.player2.findCardByName('akodo-toturi');
        });

        it('should give other friendly Lion characters +1 military', function() {
            expect(this.brash.militarySkill).toBe(2);
            expect(this.commanderOfTheLegions.militarySkill).toBe(4);
            expect(this.berserker.militarySkill).toBe(4);
            expect(this.enemeyAkodoToturi.militarySkill).toBe(6);
            expect(this.enemyNegotiator.militarySkill).toBe(1);
            expect(this.enemyYouth.militarySkill).toBe(2);
        });

        it('should prevent fate from being removed from other friendly Lion characters in the fate phase', function() {
            this.commanderOfTheLegions.fate = 1;
            this.enemeyAkodoToturi.fate = 1;
            this.berserker.fate = 1;
            this.brash.fate = 1;
            this.noMoreActions();


            this.flow.finishConflictPhase();
            this.player2.clickPrompt('Done');

            expect(this.brash.fate).toBe(0);
            expect(this.commanderOfTheLegions.fate).toBe(0);
            expect(this.enemeyAkodoToturi.fate).toBe(0);
            expect(this.berserker.fate).toBe(1);
        });

        it('should not prevent fate from being removed from characters in non-fate phase', function() {
            this.noMoreActions();
            this.commanderOfTheLegions.fate = 1;
            this.enemeyAkodoToturi.fate = 1;
            this.berserker.fate = 1;

            this.initiateConflict({
                type: 'political',
                ring: 'void',
                attackers: [this.brash],
                defenders: []
            });

            this.player2.pass();
            this.player1.pass();
            expect(this.player1).toHavePrompt('void ring');
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.commanderOfTheLegions);
            expect(this.player1).toBeAbleToSelect(this.enemeyAkodoToturi);
        });
    });
});

describe('Commander of the Legions with a printed cost 4 Lion character', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['commander-of-the-legions', 'matsu-berserker', 'akodo-motivator'],
                    honor: 15
                },
                player2: {
                    inPlay: ['moto-youth'],
                    honor: 10
                }
            });

            this.commanderOfTheLegions = this.player1.findCardByName('commander-of-the-legions');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.motivator = this.player1.findCardByName('akodo-motivator');
        });

        it('should not prevent fate from being removed from a Lion character with printed cost 4', function() {
            this.commanderOfTheLegions.fate = 1;
            this.berserker.fate = 1;
            this.motivator.fate = 1;
            this.noMoreActions();

            this.flow.finishConflictPhase();
            this.player2.clickPrompt('Done');

            expect(this.commanderOfTheLegions.fate).toBe(0);
            expect(this.motivator.fate).toBe(0);
            expect(this.berserker.fate).toBe(1);
        });
    });
});

describe('Commander of the Legions with less than 5 more honor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['commander-of-the-legions', 'matsu-berserker'],
                    honor: 14
                },
                player2: {
                    inPlay: ['moto-youth'],
                    honor: 10
                }
            });

            this.commanderOfTheLegions = this.player1.findCardByName('commander-of-the-legions');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.enemyYouth = this.player2.findCardByName('moto-youth');
        });

        it('should not prevent fate removal in the fate phase when the honor lead is only 4', function() {
            this.commanderOfTheLegions.fate = 1;
            this.berserker.fate = 1;
            this.noMoreActions();

            this.flow.finishConflictPhase();
            this.player2.clickPrompt('Done');

            expect(this.player1.honor).toBe(14);
            expect(this.player2.honor).toBe(10);
            expect(this.commanderOfTheLegions.fate).toBe(0);
            expect(this.berserker.fate).toBe(0);
        });
    });
});
