describe('Kinki', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'shinjo-outrider',
                        'aggressive-moto',
                        'iuchi-wayfinder',
                        'kakita-toshimoko',
                        'doji-challenger'
                    ]
                },
                player2: {
                    inPlay: ['relentless-inquisitor'],
                    hand: ['kinki']
                }
            });
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.moto = this.player1.findCardByName('aggressive-moto');
            this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.inquisitor = this.player2.findCardByName('relentless-inquisitor');
            this.kinki = this.player2.findCardByName('kinki');

            this.outrider.fate = 1;
            this.challenger.fate = 1;

            this.player1.pass();
            this.player2.playAttachment(this.kinki, this.inquisitor);
        });

        it('should allow targeting a participating character eligible for the effect', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto, this.toshimoko],
                defenders: [this.inquisitor],
                type: 'military'
            });

            this.player2.clickCard(this.kinki);
            expect(this.player2).toBeAbleToSelect(this.outrider);
            expect(this.player2).toBeAbleToSelect(this.moto);
            expect(this.player2).toBeAbleToSelect(this.toshimoko);
            expect(this.player2).not.toBeAbleToSelect(this.challenger); // not participating
            expect(this.player2).not.toBeAbleToSelect(this.wayfinder); // not participating
            expect(this.player2).not.toBeAbleToSelect(this.inquisitor); // not controlled by opponent
        });

        it('should give you a choice if both effects can impact the target', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto],
                defenders: [this.inquisitor],
                type: 'military'
            });

            this.player2.clickCard(this.kinki);
            this.player2.clickCard(this.outrider);
            expect(this.player1).toHavePromptButton('Remove a fate from this character');
            expect(this.player1).toHavePromptButton('Move this character home');
        });

        it('should remove a fate if selected', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto],
                defenders: [this.inquisitor],
                type: 'military'
            });

            const fate = this.outrider.fate;
            this.player2.clickCard(this.kinki);
            this.player2.clickCard(this.outrider);
            this.player1.clickPrompt('Remove a fate from this character');
            expect(this.outrider.fate).toBe(fate - 1);
            expect(this.outrider.isParticipating()).toBe(true);
            expect(this.kinki.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Kinki, sacrificing Kinki to remove 1 fate from Shinjo Outrider'
            );
        });

        it('should move home if selected', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto],
                defenders: [this.inquisitor]
            });

            const fate = this.outrider.fate;
            this.player2.clickCard(this.kinki);
            this.player2.clickCard(this.outrider);
            this.player1.clickPrompt('Move this character home');
            expect(this.outrider.fate).toBe(fate);
            expect(this.outrider.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 uses Kinki, sacrificing Kinki to send Shinjo Outrider home');
        });

        it('should not give you a choice if target has no fate', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto],
                defenders: [this.inquisitor]
            });

            this.player2.clickCard(this.kinki);
            this.player2.clickCard(this.moto);
            expect(this.player1).not.toHavePromptButton('Remove a fate from this character');
            expect(this.player1).not.toHavePromptButton('Move this character home');
            expect(this.moto.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 uses Kinki, sacrificing Kinki to send Aggressive Moto home');
        });

        it('should not work in a pol conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto, this.toshimoko],
                defenders: [this.inquisitor],
                type: 'political'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.kinki);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should not work if parent is not participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.outrider, this.moto, this.toshimoko],
                defenders: [],
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.kinki);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});

describe('Kinki with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'endless-plains-skirmisher'],
                    hand: ['kinki']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.kinki = this.player1.findCardByName('kinki');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');
            this.player1.playAttachment(this.kinki, this.whisperer);

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on the enemy side, whoever controls it, and its controller selects', function () {
            this.player2.pass();
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.kinki);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher2);
            this.player1.clickCard(this.skirmisher1);
            expect(this.player1).toHavePromptButton('Move this character home');
            this.player1.clickPrompt('Move this character home');
            expect(this.skirmisher1.isParticipating()).toBe(false);
        });
    });
});
