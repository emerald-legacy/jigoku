describe('Scarlet Sabre', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-liar', 'bayushi-manipulator'],
                    hand: ['scarlet-sabre']
                },
                player2: {
                    inPlay: ['yogo-hiroue'],
                    hand: ['scarlet-sabre']
                }
            });

            this.liar = this.player1.findCardByName('bayushi-liar');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.yogoHiroue = this.player2.findCardByName('yogo-hiroue');
            this.sabre1 = this.player1.findCardByName('scarlet-sabre');
            this.sabre2 = this.player2.findCardByName('scarlet-sabre');

            this.player1.playAttachment(this.sabre1, this.manipulator);
            this.player2.playAttachment(this.sabre2, this.yogoHiroue);
        });

        it('should make opponent lose a fate when parent wins a conflict as first player', function () {
            this.noMoreActions();
            const fate = this.player2.fate;

            this.initiateConflict({
                type: 'political',
                attackers: [this.liar, this.manipulator],
                defenders: [this.yogoHiroue]
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.manipulator);
            expect(this.player1).not.toBeAbleToSelect(this.sabre1);
            this.player1.clickCard(this.manipulator);
            expect(this.player2.fate).toBe(fate - 1);
            expect(this.getChatLogs(10)).toContain('player1 uses Bayushi Manipulator\'s gained ability from Scarlet Sabre to make player2 lose 1 fate');
        });

        it('can\'t trigger at home', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.liar],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.getChatLogs(3)).toContain('player1 won a political conflict 3 vs 0');
        });

        it('can\'t trigger after losing the conflict & can\'t trigger as 2nd player', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.manipulator],
                defenders: [this.yogoHiroue]
            });
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.getChatLogs(3)).toContain('player2 won a political conflict 4 vs 1');
        });
    });
});

describe('Scarlet Sabre on a character the opponent took control of', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 11,
                    inPlay: ['bayushi-liar', 'bayushi-manipulator'],
                    hand: ['scarlet-sabre']
                },
                player2: {
                    honor: 10,
                    hand: ['blackmail']
                }
            });
            this.liar = this.player1.findCardByName('bayushi-liar');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.reactions = this.manipulator.getReactions().length;
            this.sabre = this.player1.playAttachment('scarlet-sabre', this.manipulator);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.liar],
                defenders: []
            });
            this.player2.clickCard('blackmail');
            this.player2.clickCard(this.manipulator);
        });

        it('keeps the ability while the Sabre\'s controller is first player', function () {
            expect(this.getChatLogs(5)).toContain('player2 plays Blackmail to take control of Bayushi Manipulator');
            expect(this.manipulator.controller).toBe(this.player2.player);
            expect(this.sabre.controller).toBe(this.player1.player);
            expect(this.player1.player.firstPlayer).toBe(true);
            expect(this.manipulator.getReactions().length).toBe(this.reactions + 1);
        });
    });
});
