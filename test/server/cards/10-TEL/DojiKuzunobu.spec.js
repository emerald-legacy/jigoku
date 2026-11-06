describe('Doji Kuzunobu', function () {
    integration(function () {
        describe('while attacking', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: ['doji-kuzunobu', 'adept-of-shadows'],
                        hand: ['iuchi-wayfinder', 'banzai']
                    },
                    player2: {
                        fate: 10,
                        inPlay: ['doji-whisperer'],
                        hand: ['iuchi-wayfinder', 'forged-edict']
                    }
                });
                this.kuzunobu = this.player1.findCardByName('doji-kuzunobu');
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.wayfinder1 = this.player1.findCardByName('iuchi-wayfinder');
                this.banzai = this.player1.findCardByName('banzai');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.wayfinder2 = this.player2.findCardByName('iuchi-wayfinder');
                this.forgedEdict = this.player2.findCardByName('forged-edict');
                this.noMoreActions();
            });

            it('should stop both players from triggering reactions while he participates', function () {
                this.initiateConflict({
                    attackers: [this.kuzunobu],
                    defenders: []
                });
                this.player2.clickCard(this.wayfinder2);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Home');
                expect(this.wayfinder2.location).toBe('play area');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');

                this.player1.clickCard(this.wayfinder1);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Home');
                expect(this.wayfinder1.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow reactions while he is at home', function () {
                this.initiateConflict({
                    attackers: [this.adept],
                    defenders: []
                });
                this.player2.clickCard(this.wayfinder2);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Home');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.wayfinder2);
            });

            it('should still offer interrupts', function () {
                this.initiateConflict({
                    attackers: [this.kuzunobu],
                    defenders: [this.whisperer]
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.kuzunobu);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.forgedEdict);
                this.player2.clickCard(this.forgedEdict);
                this.player2.clickCard(this.whisperer);
                expect(this.whisperer.isDishonored).toBe(true);
                expect(this.kuzunobu.getMilitarySkill()).toBe(3);
            });
        });

        describe('while defending', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        inPlay: ['adept-of-shadows'],
                        hand: ['iuchi-wayfinder']
                    },
                    player2: {
                        inPlay: ['doji-kuzunobu']
                    }
                });
                this.adept = this.player1.findCardByName('adept-of-shadows');
                this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.kuzunobu = this.player2.findCardByName('doji-kuzunobu');
                this.noMoreActions();
            });

            it('should stop reactions', function () {
                this.initiateConflict({
                    attackers: [this.adept],
                    defenders: [this.kuzunobu]
                });
                this.player2.pass();
                this.player1.clickCard(this.wayfinder);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Home');
                expect(this.wayfinder.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('with a forced reaction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuzunobu', 'arrogant-kakita']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.kuzunobu = this.player1.findCardByName('doji-kuzunobu');
                this.kakita = this.player1.findCardByName('arrogant-kakita');
                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.noMoreActions();
            });

            it('should still resolve it while he participates', function () {
                this.initiateConflict({
                    attackers: [this.kuzunobu, this.kakita],
                    defenders: [this.whisperer]
                });
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.whisperer);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(5)).toContain('Arrogant Kakita: 4 vs 1: Doji Whisperer');
            });
        });
    });
});
