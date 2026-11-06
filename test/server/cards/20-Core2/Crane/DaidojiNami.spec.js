describe('Daidoji Nami', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['daidoji-nami', 'akodo-gunso', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'doji-challenger', 'kakita-yoshi']
                }
            });
            this.nami = this.player1.findCardByName('daidoji-nami');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.noMoreActions();
        });

        it('should sacrifice a friendly participating character to send a participating enemy character home', function() {
            this.initiateConflict({
                attackers: [this.nami, this.gunso]
            });
            this.player1.clickCard(this.yoshi);
            this.player2.assignDefenders([this.berserker, this.challenger]);
            this.player2.pass();
            this.player1.clickCard(this.nami);
            expect(this.player1).toHavePrompt('Daidōji Nami');
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.gunso);
            this.player1.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.nami);
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.berserker);
            this.player1.clickCard(this.gunso);
            expect(this.gunso.location).toBe('dynasty discard pile');
            expect(this.berserker.isParticipating()).toBe(false);
            expect(this.berserker.location).toBe('play area');
            expect(this.challenger.isParticipating()).toBe(true);
        });

        it('should not be usable when no enemy character is participating', function() {
            this.initiateConflict({
                attackers: [this.nami, this.gunso]
            });
            this.player1.clickPrompt('No Target');
            this.player2.assignDefenders([]);
            this.player2.pass();
            this.player1.clickCard(this.nami);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.gunso.location).toBe('play area');
        });

        it('should not be usable while it is not participating', function() {
            this.initiateConflict({
                attackers: [this.gunso],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.nami);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.gunso.location).toBe('play area');
            expect(this.berserker.isParticipating()).toBe(true);
        });
    });
});

describe('Daidoji Nami with characters on the other side than their controller', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['daidoji-nami', 'doji-challenger', 'endless-plains-skirmisher']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.nami = this.player2.findCardByName('daidoji-nami');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.nami, this.challenger]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on the enemy side, whoever controls it', function() {
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player2.clickCard(this.nami);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            expect(this.player2).toBeAbleToSelect(this.skirmisher2);
            expect(this.player2).not.toBeAbleToSelect(this.skirmisher1);
            this.player2.clickCard(this.skirmisher2);
            expect(this.player2).toHavePrompt('Select card to sacrifice');
            this.player2.clickCard(this.challenger);
            expect(this.skirmisher2.isParticipating()).toBe(false);
        });
    });
});
