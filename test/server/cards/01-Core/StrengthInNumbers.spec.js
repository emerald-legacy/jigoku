describe('Strength in Numbers', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider', 'hida-guardian', 'akodo-gunso'],
                    hand: ['strength-in-numbers']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'brash-samurai', 'doji-hotaru', 'matsu-berserker'],
                    hand: ['strength-in-numbers'],
                    provinces: ['entrenched-position']
                }
            });
            this.borderRider = this.player1.findCardByName('border-rider');
            this.guardian = this.player1.findCardByName('hida-guardian');
            this.akodoGunso = this.player1.findCardByName('akodo-gunso');
            this.p1Strength = this.player1.findCardByName('strength-in-numbers');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.hotaru = this.player2.findCardByName('doji-hotaru');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.p2Strength = this.player2.findCardByName('strength-in-numbers');
        });

        it('cannot be played outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.p1Strength);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.p1Strength.location).toBe('hand');
        });

        describe('during a conflict with 2 attackers', function() {
            beforeEach(function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    province: 'entrenched-position',
                    attackers: [this.borderRider, this.guardian],
                    defenders: [this.whisperer, this.brash, this.hotaru]
                });
            });

            it('moves home a defending character with glory equal to the number of attacking characters', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1Strength);
                expect(this.player1).toHavePrompt('Strength in Numbers');
                expect(this.player1).toBeAbleToSelect(this.brash);
                this.player1.clickCard(this.brash);
                expect(this.brash.isParticipating()).toBe(false);
                expect(this.brash.location).toBe('play area');
                expect(this.whisperer.isDefending()).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 plays Strength in Numbers to send Brash Samurai home');
            });

            it('cannot choose a defending character with glory higher than the number of attacking characters', function() {
                this.player2.pass();
                expect(this.hotaru.glory).toBe(3);
                this.player1.clickCard(this.p1Strength);
                expect(this.player1).toHavePrompt('Strength in Numbers');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.hotaru);
            });

            it('cannot choose a character that is not defending', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1Strength);
                expect(this.player1).toHavePrompt('Strength in Numbers');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.berserker);
                expect(this.player1).not.toBeAbleToSelect(this.guardian);
                expect(this.player1).not.toBeAbleToSelect(this.akodoGunso);
            });

            it('cannot be played by the defending player', function() {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.p2Strength);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.p2Strength.location).toBe('hand');
            });
        });

        it('counts every attacking character for X', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'air',
                province: 'entrenched-position',
                attackers: [this.borderRider, this.guardian, this.akodoGunso],
                defenders: [this.whisperer, this.hotaru]
            });
            this.player2.pass();
            this.player1.clickCard(this.p1Strength);
            expect(this.player1).toHavePrompt('Strength in Numbers');
            expect(this.player1).toBeAbleToSelect(this.hotaru);
            this.player1.clickCard(this.hotaru);
            expect(this.hotaru.isParticipating()).toBe(false);
        });
    });
});
