describe('Way of the Lion', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'doji-whisperer'],
                    hand: ['way-of-the-lion', 'way-of-the-lion']
                },
                player2: {
                    inPlay: ['akodo-gunso', 'shiba-peacemaker']
                }
            });
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            [this.lion, this.lion2] = this.player1.filterCardsByName('way-of-the-lion', 'hand');
            this.gunso = this.player2.findCardByName('akodo-gunso');
            this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
        });

        it('doubles the base military skill of a Lion character during a conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.lion);
            expect(this.player1).toHavePrompt('Way of the Lion');
            this.player1.clickCard(this.berserker);
            expect(this.berserker.getBaseMilitarySkill()).toBe(6);
            expect(this.berserker.militarySkill).toBe(6);
        });

        it('can choose any Lion character, but not a non-Lion character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker, this.whisperer],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.lion);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.peacemaker);
            this.player1.clickCard(this.gunso);
            expect(this.gunso.militarySkill).toBe(4);
        });

        it('quadruples the skill when two copies are played on the same character (ruling #125)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.lion);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.militarySkill).toBe(6);
            this.player2.pass();
            this.player1.clickCard(this.lion2);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.getBaseMilitarySkill()).toBe(12);
            expect(this.berserker.militarySkill).toBe(12);
        });

        it('lasts until the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.lion);
            this.player1.clickCard(this.gunso);
            expect(this.gunso.militarySkill).toBe(4);
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 won a military conflict 4 vs 3');
            expect(this.gunso.militarySkill).toBe(2);
        });

        it('cannot be played outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.lion);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.lion.location).toBe('hand');
            expect(this.berserker.militarySkill).toBe(3);
        });
    });
});
