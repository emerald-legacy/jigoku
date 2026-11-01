describe('Rout', function() {
    integration(function() {
        describe('Rout during a military conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-gunso', 'doji-whisperer', 'matsu-berserker', 'isawa-kaede'],
                        hand: ['rout']
                    },
                    player2: {
                        inPlay: ['hida-guardian', 'border-rider']
                    }
                });
                this.gunso = this.player1.findCardByName('akodo-gunso');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.kaede = this.player1.findCardByName('isawa-kaede');
                this.rout = this.player1.findCardByName('rout');
                this.guardian = this.player2.findCardByName('hida-guardian');
                this.borderRider = this.player2.findCardByName('border-rider');
            });

            it('cannot be played outside a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.rout);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.rout.location).toBe('hand');
            });

            describe('with a participating Bushi', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.gunso, this.whisperer],
                        defenders: [this.guardian, this.borderRider]
                    });
                    this.player2.pass();
                });

                it('moves home an opponent\'s character with lower military skill than a participating Bushi you control', function() {
                    this.player1.clickCard(this.rout);
                    expect(this.player1).toHavePrompt('Rout');
                    expect(this.player1).toBeAbleToSelect(this.guardian);
                    this.player1.clickCard(this.guardian);
                    expect(this.guardian.isParticipating()).toBe(false);
                    expect(this.guardian.location).toBe('play area');
                    expect(this.borderRider.isParticipating()).toBe(true);
                    expect(this.rout.location).toBe('conflict discard pile');
                    expect(this.getChatLogs(3)).toContain('player1 plays Rout to send Hida Guardian home');
                });

                it('cannot choose a character whose military skill equals the participating Bushi\'s', function() {
                    this.player1.clickCard(this.rout);
                    expect(this.player1).toHavePrompt('Rout');
                    expect(this.player1).toBeAbleToSelect(this.guardian);
                    expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                });

                it('does not count a Bushi you control that is not participating', function() {
                    expect(this.berserker.militarySkill).toBe(3);
                    expect(this.berserker.isParticipating()).toBe(false);
                    this.player1.clickCard(this.rout);
                    expect(this.player1).toHavePrompt('Rout');
                    expect(this.player1).toBeAbleToSelect(this.guardian);
                    expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                });

                it('cannot choose a character you control', function() {
                    this.player1.clickCard(this.rout);
                    expect(this.player1).toHavePrompt('Rout');
                    expect(this.player1).toBeAbleToSelect(this.guardian);
                    expect(this.player1).not.toBeAbleToSelect(this.whisperer);
                });

                it('still counts a bowed participating Bushi\'s military skill (ruling #88)', function() {
                    this.gunso.bow();
                    this.game.checkGameState(true);
                    expect(this.gunso.bowed).toBe(true);
                    expect(this.gunso.isParticipating()).toBe(true);
                    this.player1.clickCard(this.rout);
                    expect(this.player1).toHavePrompt('Rout');
                    expect(this.player1).toBeAbleToSelect(this.guardian);
                    this.player1.clickCard(this.guardian);
                    expect(this.guardian.isParticipating()).toBe(false);
                });
            });

            it('does not count a participating character that is not a Bushi', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kaede, this.gunso],
                    defenders: [this.guardian, this.borderRider]
                });
                this.player2.pass();
                expect(this.kaede.militarySkill).toBe(3);
                this.player1.clickCard(this.rout);
                expect(this.player1).toHavePrompt('Rout');
                expect(this.player1).toBeAbleToSelect(this.guardian);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
            });
        });

        describe('Rout during a political conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-guardian'],
                        hand: ['rout']
                    },
                    player2: {
                        inPlay: ['bayushi-liar', 'brash-samurai']
                    }
                });
                this.guardian = this.player1.findCardByName('hida-guardian');
                this.rout = this.player1.findCardByName('rout');
                this.liar = this.player2.findCardByName('bayushi-liar');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.guardian],
                    defenders: [this.liar, this.brash]
                });
                this.player2.pass();
            });

            it('can choose a character with a dash military skill, counted as 0 (ruling #87)', function() {
                expect(this.liar.hasDash('military')).toBe(true);
                this.player1.clickCard(this.rout);
                expect(this.player1).toHavePrompt('Rout');
                expect(this.player1).toBeAbleToSelect(this.liar);
                expect(this.player1).not.toBeAbleToSelect(this.brash);
                this.player1.clickCard(this.liar);
                expect(this.liar.isParticipating()).toBe(false);
                expect(this.liar.location).toBe('play area');
            });
        });
    });
});
