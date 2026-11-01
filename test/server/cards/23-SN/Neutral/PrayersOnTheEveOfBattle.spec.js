describe('Prayers on the Eve of Battle', function () {
    integration(function () {
        describe('Return to hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        conflictDiscard: ['prayers-on-the-eve-of-battle', 'prayers-on-the-eve-of-battle']
                    }
                });
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.borderlands = this.player2.findCardByName('borderlands-defender');

                this.atw = this.player1.findCardByName('against-the-waves');
                this.prayers1 = this.player2.filterCardsByName('prayers-on-the-eve-of-battle')[0];
                this.prayers2 = this.player2.filterCardsByName('prayers-on-the-eve-of-battle')[1];
            });

            it('should return to hand if opponent passes with a ready character', function () {
                this.noMoreActions();
                this.player1.passConflict();
                expect(this.player2).toHavePrompt('Triggered abilities');
                expect(this.player2).toBeAbleToSelect(this.prayers1);
                expect(this.player2).toBeAbleToSelect(this.prayers2);
                this.player2.clickCard(this.prayers1);

                expect(this.prayers1.location).toBe('hand');
                expect(this.player1).toHavePrompt('Action Window');

                expect(this.getChatLogs(5)).toContain('player2 uses Prayers on the Eve of Battle to move Prayers on the Eve of Battle to player2\'s hand');
            });

            it('should not trigger if opponent passes with no ready characters', function () {
                this.player1.clickCard(this.atw);
                this.player1.clickCard(this.asakoTsuki);
                this.noMoreActions();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player2).not.toHavePrompt('Triggered abilities');
            });

            it('should not prompt you if you pass with ready characters', function () {
                this.player1.clickCard(this.atw);
                this.player1.clickCard(this.asakoTsuki);
                this.noMoreActions();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player2).not.toHavePrompt('Triggered abilities');

                this.noMoreActions();
                this.player2.passConflict();

                expect(this.player2).not.toHavePrompt('Triggered abilities');
            });
        });

        describe('Trigger', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki', 'doji-challenger'],
                        hand: ['prayers-on-the-eve-of-battle']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['prayers-on-the-eve-of-battle']
                    }
                });
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.borderlands = this.player2.findCardByName('borderlands-defender');
                this.challenger = this.player1.findCardByName('doji-challenger');

                this.prayers1 = this.player1.findCardByName('prayers-on-the-eve-of-battle');
                this.prayers2 = this.player2.findCardByName('prayers-on-the-eve-of-battle');

                this.player1.playAttachment(this.prayers1, this.asakoTsuki);
                this.player2.playAttachment(this.prayers2, this.borderlands);
            });

            it('is removed from the game when the attached character sits the conflict out', function () {
                const fate = this.player1.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.borderlands]
                });

                this.noMoreActions();
                // both players' forced reactions: the first player orders them
                this.player1.clickCard(this.prayers1);

                expect(this.asakoTsuki.isParticipating()).toBe(false);
                expect(this.prayers1.location).toBe('removed from game');
                expect(this.player1.fate).toBe(fate);
            });

            it('happy path', function () {
                const fate = this.player1.fate;
                const fate2 = this.player2.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asakoTsuki],
                    defenders: [this.borderlands]
                });

                this.noMoreActions();
                // both players' forced reactions: the first player orders them
                this.player1.clickCard(this.prayers1);
                expect(this.player1.fate).toBe(fate);
                expect(this.player2.fate).toBe(fate2 + 1);

                expect(this.prayers1.location).toBe('removed from game');
                expect(this.prayers2.location).toBe('conflict discard pile');

                expect(this.getChatLogs(10)).toContain('player1 uses Prayers on the Eve of Battle to remove Prayers on the Eve of Battle from the game');
                expect(this.getChatLogs(10)).toContain('player2 uses Prayers on the Eve of Battle to gain 1 fate and discard Prayers on the Eve of Battle');
            });
        });
    });
});

describe('Prayers on the Eve of Battle when the conflict ends', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asako-tsuki', 'doji-challenger'],
                    hand: ['prayers-on-the-eve-of-battle']
                },
                player2: {
                    inPlay: ['borderlands-defender']
                }
            });
            this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.borderlands = this.player2.findCardByName('borderlands-defender');
            this.prayers = this.player1.findCardByName('prayers-on-the-eve-of-battle');
        });

        it('resolves at the end of the conflict, after the ring effect', function () {
            this.player1.playAttachment(this.prayers, this.asakoTsuki);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.asakoTsuki, this.challenger],
                defenders: [this.borderlands]
            });
            const fate = this.player1.fate;
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Choose an effect to resolve');
            expect(this.prayers.location).toBe('play area');
            expect(this.player1.fate).toBe(fate);
            this.player1.clickPrompt('Gain 2 honor');
            expect(this.prayers.location).toBe('conflict discard pile');
            expect(this.player1.fate).toBe(fate + 1);
        });
    });
});

describe('Prayers on the Eve of Battle and a conflict that fails to initiate', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['master-of-gisei-toshi', 'ikoma-kiyono', 'guest-of-honor'],
                    hand: ['prayers-on-the-eve-of-battle'],
                    conflictDiscard: ['forged-edict']
                },
                player2: {
                    inPlay: ['bayushi-kachiko'],
                    hand: ['know-the-terrain', 'castigated'],
                    provinces: ['endless-plains', 'rally-to-the-cause', 'secret-cache', 'manicured-garden'],
                    role: 'keeper-of-void'
                }
            });
            this.rally = this.player2.findCardByName('rally-to-the-cause');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.gisei = this.player1.findCardByName('master-of-gisei-toshi');
            this.kiyono = this.player1.findCardByName('ikoma-kiyono');
            this.prayers = this.player1.findCardByName('prayers-on-the-eve-of-battle');
            this.edict = this.player1.findCardByName('forged-edict');

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.garden.facedown = false;
            this.noMoreActions();
            this.player1.clickCard(this.gisei);
            this.player1.clickRing('earth');
        });

        it('does not react to it ending', function() {
            this.player1.moveCard(this.edict, 'hand');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.kiyono],
                defenders: [],
                province: this.garden,
                ring: 'air'
            });
            this.player2.clickCard('castigated');
            this.player2.clickCard(this.kiyono);
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            this.kiyono.bowed = false;
            this.noMoreActions();
            this.player2.passConflict();
            this.player1.playAttachment(this.prayers, 'guest-of-honor');
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.kiyono],
                province: this.rally,
                ring: 'void'
            });
            this.player2.clickCard('know-the-terrain');
            this.player1.clickCard(this.edict);
            this.player1.clickCard(this.kiyono);
            expect(this.getChatLogs(3)).toContain('player1 has failed to initiate a conflict because they no longer have any legal attackers');
            expect(this.prayers.location).toBe('play area');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
