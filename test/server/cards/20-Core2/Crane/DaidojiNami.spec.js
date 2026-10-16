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
