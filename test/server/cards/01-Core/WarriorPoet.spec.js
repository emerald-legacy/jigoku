describe('Warrior Poet', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['warrior-poet', 'matsu-berserker'],
                    hand: ['retreat']
                },
                player2: {
                    inPlay: ['shiba-peacemaker', 'brash-samurai', 'shinjo-outrider']
                }
            });
            this.poet = this.player1.findCardByName('warrior-poet');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.retreat = this.player1.findCardByName('retreat');
            this.peacemaker = this.player2.findCardByName('shiba-peacemaker');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.outrider = this.player2.findCardByName('shinjo-outrider');
        });

        it('gives each participating opposing character -1 military and -1 political', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.poet, this.berserker],
                defenders: [this.peacemaker, this.brash]
            });
            this.player2.pass();
            this.player1.clickCard(this.poet);
            expect(this.peacemaker.militarySkill).toBe(3);
            expect(this.peacemaker.politicalSkill).toBe(0);
            expect(this.brash.militarySkill).toBe(1);
            expect(this.brash.politicalSkill).toBe(0);
            expect(this.outrider.militarySkill).toBe(2);
            expect(this.outrider.politicalSkill).toBe(2);
            expect(this.poet.militarySkill).toBe(2);
            expect(this.berserker.militarySkill).toBe(3);
        });

        it('cannot be used while not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.poet);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.peacemaker.militarySkill).toBe(4);
        });

        it('does not affect a character that joins the conflict after it resolved (ruling #121)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.poet, this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.poet);
            this.player2.clickCard(this.outrider);
            expect(this.outrider.isParticipating()).toBe(true);
            expect(this.outrider.militarySkill).toBe(2);
            expect(this.outrider.politicalSkill).toBe(2);
            expect(this.peacemaker.militarySkill).toBe(3);
        });

        it('keeps the penalty after Warrior Poet leaves the conflict (ruling #121)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.poet, this.berserker],
                defenders: [this.peacemaker]
            });
            this.player2.pass();
            this.player1.clickCard(this.poet);
            this.player2.pass();
            this.player1.clickCard(this.retreat);
            this.player1.clickCard(this.poet);
            expect(this.poet.isParticipating()).toBe(false);
            expect(this.peacemaker.militarySkill).toBe(3);
            expect(this.peacemaker.politicalSkill).toBe(0);
        });
    });
});
